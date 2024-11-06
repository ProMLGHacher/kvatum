import { authApi, RegisterBody, useTokensData } from "@/entities/useTokensData";
import { userApi, useUserData } from "@/entities/useUserData";
import { ActionError } from "@/shared/types/actionErrorType/ActionError";
import { isAxiosError } from "axios";

export const registerAction = async (registerBody: RegisterBody) => {
    try {
        const tokensData = await authApi.register(registerBody);
        useTokensData.getState().setTokensData(tokensData);
        const userData = await userApi.getUser();
        useUserData.getState().setUserData(userData);
        useTokensData.getState().setIsAuthorized(true);
    } catch (error) {
        if (isAxiosError(error)) {
            throw new ActionError('axios error');
        } else {
            throw error;
        }
    }
}