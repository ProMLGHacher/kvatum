import { authApi, RegisterBody, tokensDataStore } from "@/entities/tokensData"
import { userApi, userDataStore } from "@/entities/userData"
import { ActionError } from "@/shared/types/actionErrorType/ActionError"
import { isAxiosError } from "axios"

const E_TAG = "TAG_REGISTER_ACTION"

export const registerAction = async (registerBody: RegisterBody) => {
  try {
    const tokensData = await authApi.register(registerBody)
    tokensDataStore.getState().setTokensData(tokensData)
    const userData = await userApi.getUser()
    userDataStore.getState().setUserData(userData)
  } catch (error) {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status
      if (statusCode && statusCode >= 400 && statusCode < 500) {
        throw new ActionError("Неверный код подтверждения", {
          errorLevel: "low",
        })
      }

      console.warn(E_TAG, "LEVEL: MEDIUM", error)
      throw new ActionError(error.message, {
        errorLevel: "medium",
        originalError: error,
      })
    }

    console.error(E_TAG, "LEVEL: HIGH", error)
    throw new ActionError(
      "Чтото пошло не так попробуйте перезагрузить страницу",
      {
        errorLevel: "high",
        originalError: error,
      },
    )
  }
}
