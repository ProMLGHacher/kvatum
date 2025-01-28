import { userApi, UserRole, useUserData } from "@/entities/useUserData";
import { ActionError } from "@/shared/types/actionErrorType/ActionError";
import { isAxiosError } from "axios";

export const getUserAction = async () => {
  try {
    const userData = await userApi.getUser();
    useUserData.getState().setUserData(userData);
  } catch (error) {
    // TODO: maybe remove this?
    useUserData.getState().updateUserData({ role: UserRole.GUEST });

    if (isAxiosError(error)) {
      throw new ActionError("axios error");
    } else {
      throw error;
    }
  }
};
