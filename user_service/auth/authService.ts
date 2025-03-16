import { AuthRepository } from "./authRepository";
import {
  CreateUserRequest,
  LoginUserRequest,
  LogoutUserRequest,
} from "./dtos/AuthRequest.dto";

const authRepo = AuthRepository;

export const registerUser = async (data: CreateUserRequest) => {
  return authRepo.RegisterUser(data);
};
export const loginUser = async (data: LoginUserRequest) => {
  return authRepo.LoginUser(data);
};
export const logoutUser = async (token: string) => {
  return authRepo.LogoutUser(token);
};

export const refreshToken = async (refresh_token: string) => {
  return authRepo.RefreshToken(refresh_token);
};
export const validateUser = async (token: string) => {
  return authRepo.ValidateUser(token);
};
