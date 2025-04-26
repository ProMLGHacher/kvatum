import { hubsApi } from "@/entities/hubs/api/hubsApi"
import { hubsStore } from "@/entities/hubs"
import { CreateHubBody } from "@/entities/hubs/api/types"
import { getHubWorkSpacesAction } from "@/features/workSpaces"
import { getChannelsAction } from "@/features/channels"
import { WorkSpaceId } from "@/entities/workSpcae"
import { workSpaceStore } from "@/entities/workSpcae"

export const createHubAction = async (newHub: CreateHubBody) => {
  const hub = await hubsApi.createHub(newHub)
  await getHubWorkSpacesAction(hub.id)
  const workSpaces = Object.keys(
    workSpaceStore.getState().workSpaces?.[hub.id] ?? {},
  )
  await Promise.all(
    workSpaces.map((workSpace) => getChannelsAction(workSpace as WorkSpaceId)),
  )
  hubsStore.getState().addHub(hub)
}
