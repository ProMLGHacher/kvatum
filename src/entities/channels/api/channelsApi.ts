import { WorkSpaceId } from "@/entities/workSpcae"
import { $api } from "@/shared/api/api"
import { ChannelsDto } from "./types"
import { toChannels } from "../lib/toChannel"
import { Channel } from "../model/types"

export const channelsApi = {
  getChannels: async (workspaceId: WorkSpaceId): Promise<Channel[]> => {
    const response = await $api.get<ChannelsDto>(`/api/chats`, {
      params: { workspaceId },
    })
    return toChannels(response.data)
  },
}
