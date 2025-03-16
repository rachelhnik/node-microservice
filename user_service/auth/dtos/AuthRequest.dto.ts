import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateUserRequest {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: number;
}

export class LoginUserRequest {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: number;
}

export class LogoutUserRequest {
  @IsNotEmpty()
  @IsNumber()
  nonce: number;

  @IsNotEmpty()
  @IsNumber()
  user_id: number;
}
