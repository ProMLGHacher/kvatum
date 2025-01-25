import { create } from "zustand";
import { TokensDataState } from "./types";

export const useTokensData = create<TokensDataState>((set) => ({
    accessToken: null,
    refreshToken: localStorage.getItem('refreshToken') as RefreshToken ?? null,
    setTokensData: (tokensData) => {
        set(tokensData)
    },
    clearTokens: () => {
        localStorage.removeItem('refreshToken')
        set({ accessToken: null, refreshToken: null })
    }
}))