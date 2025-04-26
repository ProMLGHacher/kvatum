import { tokensDataStore } from "@/entities/tokensData"
import { userDataStore } from "@/entities/userData"

export const logOutAction = async () => {
  tokensDataStore.getState().clearTokens()
  userDataStore.getState().clearUserData()
}
