import { authApi, LoginBody, useTokensData } from "@/entities/useTokensData";
import { userApi, useUserData } from "@/entities/useUserData";
import { ActionError } from "@/shared/types/actionErrorType/ActionError";
import { isAxiosError } from "axios";

export const loginAction = async (loginBody: LoginBody) => {
    try {
        const tokensData = await authApi.login(loginBody);
        useTokensData.getState().setTokensData(tokensData);
        const userData = await userApi.getUser();
        useUserData.getState().setUserData(userData);
    } catch (error) {
        if (isAxiosError(error)) {
            throw new ActionError('axios error');
        } else {
            throw error;
        }
    }
}