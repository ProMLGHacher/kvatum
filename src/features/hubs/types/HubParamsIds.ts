import { ChannelId } from "@/entities/useChannels";
import { HubId } from "@/entities/useHub";
import { WorkSpaceId } from "@/entities/useWorkSpcae";

export type HubParamsIds = {
  hubId: HubId;
  workspaceId: WorkSpaceId;
  channelId: ChannelId;
};
