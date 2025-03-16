import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/db";
import { AuthorizationError, NotFoundError, ValidationError } from "../utils";
import {
  CreateUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
} from "./dtos/AuthRequest.dto";
import { JWT_EXPIRES_IN, JWT_SECRET } from "../config/config";
import dayjs from "dayjs";
export type AuthRepositoryType = {
  RegisterUser: (data: CreateUserRequest) => Promise<any>;
  LoginUser: (data: LoginUserRequest) => Promise<{
    accessToken: string;
    refreshToken: string;
    nonce: number;
  }>;

  LogoutUser: (token: string) => Promise<Object>;
  RefreshToken: (refresh_token: string) => Promise<Object>;
  ValidateUser: (token: string) => Promise<any>;
};

const generateAccessToken = async (user: Object): Promise<string> => {
  return await new Promise((resolve, reject) => {
    jwt.sign(user, JWT_SECRET, { expiresIn: "15m" }, (err, token) => {
      if (err) reject(err);
      else resolve(token as string);
    });
  });
};

const generateRefreshToken = async (user: Object): Promise<string> => {
  return await new Promise((resolve, reject) => {
    jwt.sign(user, JWT_SECRET, { expiresIn: "24h" }, (err, token) => {
      if (err) reject(err);
      else resolve(token as string);
    });
  });
};

const clearExpiredSessionsForUser = async (userId: number) => {
  const oneMonthAgo = dayjs().subtract(1, "month").toDate();
  return await prisma.sessions.deleteMany({
    where: { user_id: userId, createdAt: { lt: oneMonthAgo } },
  });
};

const createNewSessionForUser = async (userId: number, nonce: number) => {
  return await prisma.sessions.create({
    data: { nonce, user: { connect: { id: userId } } },
  });
};

const removeSessionForUser = async (user_id: number, nonce: number) => {
  const session = await prisma.sessions.findFirst({
    where: { nonce, user_id: user_id },
  });
  return await prisma.sessions.delete({
    where: { id: session?.id },
  });
};

const refreshSessionForUser = async (user_id: number, nonce: number) => {
  const session = await prisma.sessions.findFirst({
    where: { nonce, user_id: user_id },
  });
  const updatedSession = await prisma.sessions.update({
    where: {
      id: session?.id,
    },
    data: {
      nonce: nonce,
      refreshedAt: dayjs().toISOString(),
      lastAccessedAt: dayjs().toISOString(),
    },
  });
  return updatedSession;
};

const RegisterUser = async (data: CreateUserRequest) => {
  const alreadyExist = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
  });
  if (alreadyExist) {
    throw new ValidationError("User already exists.");
  }
  const hashedPassword = await bcrypt.hash(data.password, 10);
  const newUser = await prisma.users.create({
    data: { ...data, password: hashedPassword },
  });
  return newUser;
};
const LoginUser = async (data: LoginUserRequest) => {
  const user = await prisma.users.findFirst({
    where: {
      email: data.email,
    },
  });
  if (!user) {
    throw new NotFoundError("User not found.");
  }
  const validPassword = await bcrypt.compare(data.password, user.password);
  if (!validPassword) {
    throw new ValidationError("Incorrect password.");
  }
  const nonce = Math.floor(100000 + Math.random() * 900000);

  const payload = {
    id: user.id,
    email: user.email,
    nonce,
  };

  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);
  await clearExpiredSessionsForUser(user.id);
  await createNewSessionForUser(user.id, nonce);

  return { accessToken, refreshToken, nonce };
};
const LogoutUser = async (token: string): Promise<Object> => {
  const tokenData = token.split(" ")[1];
  const data = jwt.verify(tokenData, JWT_SECRET) as jwt.JwtPayload;
  const response = await removeSessionForUser(data.nonce, data.user_id);
  if (response) {
    return { message: "Logout successfully." };
  } else {
    return { message: "Logout failed." };
  }
};

const RefreshToken = async (refresh_token: string): Promise<Object> => {
  const data = jwt.verify(refresh_token, JWT_SECRET) as jwt.JwtPayload;
  if (!data) {
    throw new AuthorizationError("Jwt invalid.");
  }

  const payload = {
    id: data.id,
    email: data.email,
    nonce: data.nonce,
  };
  const accessToken = await generateAccessToken(payload);
  const refreshToken = await generateRefreshToken(payload);
  await clearExpiredSessionsForUser(data.id);
  await refreshSessionForUser(data.id, data.nonce);
  return { accessToken, refreshToken };
};
const ValidateUser = async (token: string) => {
  const tokenData = token.split(" ")[1];

  const user = jwt.verify(tokenData, JWT_SECRET) as jwt.JwtPayload;
  if (user) {
    return user;
  } else {
    throw new AuthorizationError("Jwt invalid.");
  }
};

export const AuthRepository: AuthRepositoryType = {
  RegisterUser,
  LoginUser,
  LogoutUser,
  RefreshToken,
  ValidateUser,
};
