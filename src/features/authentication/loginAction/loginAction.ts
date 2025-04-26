import { authApi, LoginBody, tokensDataStore } from "@/entities/tokensData"
import { userApi, userDataStore } from "@/entities/userData"
import { ActionError } from "@/shared/types/actionErrorType/ActionError"
import { isAxiosError } from "axios"

export const loginAction = async (loginBody: LoginBody) => {
  try {
    const tokensData = await authApi.login(loginBody)
    tokensDataStore.getState().setTokensData(tokensData)
    const userData = await userApi.getUser()
    userDataStore.getState().setUserData(userData)
  } catch (error) {
    if (isAxiosError(error)) {
      if (error.response?.status === 401) {
        throw new ActionError("Не верный логин или пароль")
      }
      throw new ActionError("axios error")
    } else {
      throw new ActionError(
        "Чтото пошло не так попробуйте перезагрузить страницу",
      )
    }
  }
}
