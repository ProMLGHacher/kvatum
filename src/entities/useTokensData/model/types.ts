export type TokensData = {
    accessToken: AccessToken | null;
    refreshToken: RefreshToken | null;
}

export type TokensDataActions = {
    setTokensData: (tokensData: TokensData) => void;
    clearTokens: () => void;
    setIsAuthorized: (isAuthorized: boolean) => void;
}

export type TokensDataState = {
    isAuthorized: boolean;
} & TokensData & TokensDataActions;