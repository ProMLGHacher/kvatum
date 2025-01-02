import { toUserRole } from "@/entities/useUserData/lib/toUserRole";
import { LoginDto, RefreshDto, RegisterDto } from "../api/types";
import { TokensData } from "../model/types";
import { UserRole } from "@/entities/useUserData";

export const toTokensData = (data: LoginDto | RegisterDto | RefreshDto): TokensData & { role: UserRole } => {
    const { accessToken, refreshToken, role } = data;
    return {
        accessToken,
        refreshToken,
        role: toUserRole(role),
    }
}