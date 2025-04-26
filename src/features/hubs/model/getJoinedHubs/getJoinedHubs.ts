import { hubsStore } from "@/entities/hubs"
import { hubsApi } from "@/entities/hubs/api/hubsApi"

export const getJoinedHubsAction = async () => {
  try {
    const hubs = await hubsApi.getJoinedHubs()
    hubsStore.getState().setHubs(hubs)
  } catch (error) {
    console.error(error)
  }
}
