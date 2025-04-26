import { hubsApi } from "@/entities/hubs/api/hubsApi"
import { initHubsDataAction } from "../initHubsData/initHubsData"

export const acceptInviteAction = async (inviteHash: string) => {
  await hubsApi.acceptInvite(inviteHash)
  await initHubsDataAction()
}
