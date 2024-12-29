import { authApi, useTokensData } from "@/entities/useTokensData";
import { logOutAction } from "@/features/authentication/logOutAction/logOutAction";
import { $api } from "@/shared/api/api";
import { isAxiosError } from "axios";

export const configureTokenInterceptors = () => {
    $api.interceptors.request.use(
        config => {
            const token = useTokensData.getState().accessToken;

            if (!token) return config;

            config.headers.Authorization = `${token}`;
            return config;
        }
    );

    $api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            const refToken = useTokensData.getState().refreshToken;
            
            if (error.response.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;

                if (!refToken) {
                    await logOutAction()
                    throw new Error('no refresh token')
                }

                try {
                    const tokensData = await authApi.refresh({ refreshToken: refToken })

                    useTokensData.getState().setTokensData(tokensData)

                    originalRequest.headers.Authorization = `${useTokensData.getState().accessToken}`;
                    return $api(originalRequest);
                } catch (error) {
                    if (isAxiosError(error)) {
                        if (error.response?.status === 404) {
                            await logOutAction()
                            throw new Error('refresh token expired')
                        }
                    }
                    else {
                        await logOutAction()
                        throw new Error('unknown error')
                    }
                }
            }

            return Promise.reject(error);
        }
    );
}