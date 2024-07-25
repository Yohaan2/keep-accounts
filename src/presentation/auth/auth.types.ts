import { LoginUserDto, RegisterUserDto } from "../../domain";

export interface RegisterUserRequest {
  Body: RegisterUserDto
}

export interface LoginUserRequest {
  Body: LoginUserDto
}