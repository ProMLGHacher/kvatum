import { useHubs } from "@/entities/useHub"
import { hubsApi } from "@/entities/useHub/api/hubsApi"

export const getJoinedHubsAction = async () => {
    const hubs = await hubsApi.getJoinedHubs()
    useHubs.getState().setHubsList(hubs)
}