import { ChannelId } from "@/entities/channels"
import { HubId } from "@/entities/hubs"
import { WorkSpaceId } from "@/entities/workSpcae"

export type HubParamsIds = {
  hubId: HubId
  workspaceId: WorkSpaceId
  channelId: ChannelId
}
