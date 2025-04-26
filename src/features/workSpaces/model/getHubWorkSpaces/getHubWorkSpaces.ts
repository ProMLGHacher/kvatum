import { HubId } from "@/entities/hubs"
import { workSpaceStore } from "@/entities/workSpcae"
import { workSpaceApi } from "@/entities/workSpcae/api/workSpaceApi"

export const getHubWorkSpacesAction = async (hubId: HubId) => {
  const workSpaces = await workSpaceApi.getWorkSpaceList(hubId)
  workSpaceStore.getState().setWorkSpaces(workSpaces, hubId)
}
