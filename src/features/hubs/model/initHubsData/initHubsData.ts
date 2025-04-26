import { WorkSpaceId } from "@/entities/workSpcae"

import { hubsStore } from "@/entities/hubs"
import { getJoinedHubsAction } from "../getJoinedHubs/getJoinedHubs"
import { getHubWorkSpacesAction } from "@/features/workSpaces/model/getHubWorkSpaces/getHubWorkSpaces"
import { workSpaceStore } from "@/entities/workSpcae"
import { getChannelsAction } from "@/features/channels/model/getChannels/getChannels"

export const initHubsDataAction = async () => {
  await getJoinedHubsAction()
  const hubs = hubsStore.getState().hubs
  if (hubs) {
    await Promise.all(
      Object.values(hubs).map((hub) => getHubWorkSpacesAction(hub.id)),
    )
  }
  const workSpaces = workSpaceStore.getState().workSpaces
  const allWorkSpaces = workSpaces
    ? Object.values(workSpaces)
        .map((workSpace) => {
          if (workSpace) {
            return Object.keys(workSpace)
          }
        })
        .flat()
    : []

  if (allWorkSpaces) {
    try {
      await Promise.all(
        allWorkSpaces.map(async (workSpaceId) =>
          getChannelsAction(workSpaceId as WorkSpaceId),
        ),
      )
    } catch (error) {
      console.log(error)
    }
  }
}
