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
      console.error(error.response)
      throw new ActionError("axios error")
    } else {
      throw error
    }
  }
}
