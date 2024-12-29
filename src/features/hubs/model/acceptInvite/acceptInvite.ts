import { hubsApi } from "@/entities/useHub/api/hubsApi"
import { getJoinedHubsAction } from "../getJoinedHubs/getJoinedHubs"

export const acceptInviteAction = async (inviteHash: string) => {
    await hubsApi.acceptInvite(inviteHash)
    await getJoinedHubsAction()
}
