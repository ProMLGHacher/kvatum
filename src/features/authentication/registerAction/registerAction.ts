import { authApi, RegisterBody, useTokensData } from "@/entities/useTokensData";
import { ActionError } from "@/shared/types/actionErrorType/ActionError";
import { isAxiosError } from "axios";

export const registerAction = async (registerBody: RegisterBody) => {
    try {
        const tokensData = await authApi.register(registerBody);
        useTokensData.getState().setTokensData(tokensData);
    } catch (error) {
        if (isAxiosError(error)) {
            throw new ActionError('axios error');
        } else {
            throw error;
        }
    }
}