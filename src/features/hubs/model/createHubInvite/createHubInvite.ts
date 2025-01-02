import { hubsApi } from "@/entities/useHub/api/hubsApi"


export const createHubInvite = async (hubId: string) => {
    const inviteHash = await hubsApi.createHubInvite(hubId)
    return `${window.location.origin}/invite/${inviteHash}`
}
