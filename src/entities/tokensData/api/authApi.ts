import {
  LoginBody,
  RefreshBody,
  RegisterBody,
  RequestToRegisterBody,
  LoginDto,
  RegisterDto,
  RefreshDto,
} from "./types"
import { toTokensData } from "../lib/toTokensData"
import { TokensData } from "../model/types"
import { UserRole } from "@/entities/userData"
import { $api } from "@/shared/api/api"

export const authApi = {
  login: async (body: LoginBody): Promise<TokensData & { role: UserRole }> => {
    const response = await $api.post<LoginDto>("/api/signin", body)
    return toTokensData(response.data)
  },
  requestToRegister: async (body: RequestToRegisterBody): Promise<void> => {
    await $api.post("/api/signup/request", body)
  },
  register: async (
    body: RegisterBody,
  ): Promise<TokensData & { role: UserRole }> => {
    const response = await $api.post<RegisterDto>("/api/signup/complete", body)
    return toTokensData(response.data)
  },
  refresh: async (
    body: RefreshBody,
  ): Promise<TokensData & { role: UserRole }> => {
    const response = await $api.post<RefreshDto>("/api/refresh", {
      value: body.refreshToken,
    })
    return toTokensData(response.data)
  },
}
