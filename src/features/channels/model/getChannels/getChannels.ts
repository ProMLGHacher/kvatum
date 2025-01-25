import { channelsApi } from "@/entities/useChannels/api/channelsApi";
import { useChannels } from "@/entities/useChannels/model/useChannels";
import { WorkSpaceId } from "@/entities/useWorkSpcae";

export const getChannelsAction = async (workspaceId: WorkSpaceId) => {
  const channels = await channelsApi.getChannels(workspaceId);
  useChannels.getState().setChannels(channels, workspaceId);
};
