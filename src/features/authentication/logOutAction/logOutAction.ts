import { useTokensData } from "@/entities/useTokensData";
import { useUserData } from "@/entities/useUserData";

export const logOutAction = async () => {
    useTokensData.getState().clearTokens();
    useUserData.getState().clearUserData();
}

