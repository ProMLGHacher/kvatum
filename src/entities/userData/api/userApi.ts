import { UserData } from "../model/types"
import { toUserData } from "../lib/toUserData"
import { $api } from "@/shared/api/api"

export const userApi = {
  getUser: async (): Promise<UserData> => {
    const response = await $api.get("/api/profile")
    return toUserData(response.data)
  },
}
