import { authApi, RequestToRegisterBody } from "@/entities/tokensData"
import { ActionError } from "@/shared/types/actionErrorType/ActionError"
import { isAxiosError } from "axios"

export const requestRegistrationAction = async (
  requestRegistrationBody: RequestToRegisterBody,
): Promise<void> => {
  try {
    await authApi.requestToRegister(requestRegistrationBody)
  } catch (error) {
    if (isAxiosError(error)) {
      const statusCode = error.response?.status
      if (statusCode === 409) {
        throw new ActionError(
          "Пользователь с таким email уже зарегистрирован",
          {
            errorLevel: "low",
          },
        )
      }

      if (statusCode === 400) {
        throw new ActionError("Неверный email", {
          errorLevel: "low",
        })
      }

      throw new ActionError(error.message, {
        errorLevel: "medium",
        originalError: error,
      })
    }

    throw new ActionError(
      "Чтото пошло не так попробуйте перезагрузить страницу",
      {
        errorLevel: "high",
        originalError: error,
      },
    )
  }
}
