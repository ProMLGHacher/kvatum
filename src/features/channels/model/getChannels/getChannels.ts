import { channelsApi } from "@/entities/channels/api/channelsApi"
import { channelsStore } from "@/entities/channels/model/channelsStore"
import { WorkSpaceId } from "@/entities/workSpcae"

export const getChannelsAction = async (workspaceId: WorkSpaceId) => {
  const channels = await channelsApi.getChannels(workspaceId)
  channelsStore.getState().setChannels(channels, workspaceId)
}
