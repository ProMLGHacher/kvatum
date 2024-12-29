import { authApi, RequestToRegisterBody } from "@/entities/useTokensData";
import { ActionError } from "@/shared/types/actionErrorType/ActionError";
import { AxiosResponse, isAxiosError } from "axios";

export const requestRegistrationAction =
    async (requestRegistrationBody: RequestToRegisterBody): Promise<AxiosResponse<any, any>> => {
        try {
            const response = await authApi.requestToRegister(requestRegistrationBody);
            return response;
        } catch (error) {
            if (isAxiosError(error)) {
                console.error(error.response);
                throw new ActionError('axios error');
            } else {
                throw error;
            }
        }
    }