import { authApi, RegisterBody, tokensDataStore } from "@/entities/tokensData"
import { userApi, userDataStore } from "@/entities/userData"
import { ActionError } from "@/shared/types/actionErrorType/ActionError"
import { isAxiosError } from "axios"

export const registerAction = async (registerBody: RegisterBody) => {
  try {
    const tokensData = await authApi.register(registerBody)
    tokensDataStore.getState().setTokensData(tokensData)
    const userData = await userApi.getUser()
    userDataStore.getState().setUserData(userData)
  } catch (error) {
    if (isAxiosError(error)) {
      throw new ActionError("axios error")
    } else {
      throw error
    }
  }
}
