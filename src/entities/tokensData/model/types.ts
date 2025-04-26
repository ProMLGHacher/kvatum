export type TokensData = {
  accessToken: AccessToken | null
  refreshToken: RefreshToken | null
}

export type TokensDataActions = {
  setTokensData: (tokensData: TokensData) => void
  clearTokens: () => void
}

export type TokensDataState = TokensData & TokensDataActions
