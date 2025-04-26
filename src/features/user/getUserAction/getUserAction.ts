import { userApi, UserRole, userDataStore } from "@/entities/userData"
import { ActionError } from "@/shared/types/actionErrorType/ActionError"
import { isAxiosError } from "axios"

export const getUserAction = async () => {
  try {
    const userData = await userApi.getUser()
    userDataStore.getState().setUserData(userData)
  } catch (error) {
    // TODO: maybe remove this?
    userDataStore.getState().updateUserData({ role: UserRole.GUEST })

    if (isAxiosError(error)) {
      throw new ActionError("axios error")
    } else {
      throw error
    }
  }
}
