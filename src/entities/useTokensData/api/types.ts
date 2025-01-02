import { UserRoleDto } from "@/entities/useUserData/api/types";

export type LoginBody = {
    email: Email;
    password: Password;
}

export type RegisterBody = {
    email: Email;
    verificationCode: string;
}

export type RefreshBody = {
    refreshToken: RefreshToken;
}

export type RequestToRegisterBody = {
    email: Email;
    nickname: string;
    password: Password;
}

export type LoginDto = {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    role: UserRoleDto;
}

export type RegisterDto = {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    role: UserRoleDto;
}

export type RefreshDto = {
    accessToken: AccessToken;
    refreshToken: RefreshToken;
    role: UserRoleDto;
}