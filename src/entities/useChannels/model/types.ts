import { WorkSpaceId } from "@/entities/useWorkSpcae";

export type ChannelId = Brand<string, "ChannelId">;

export type ChannelType = "Conference" | "Chat" | "Channel";

export type Channel = {
  id: ChannelId;
  name: string;
  type: ChannelType;
};

export type ChannelsActions = {
  setChannels: (channels: Channel[], workSpaceId: WorkSpaceId) => void;
  clearChannels: (workSpaceId: WorkSpaceId) => void;
};

export type ChannelsStore = {
  channels: Record<WorkSpaceId, Record<ChannelId, Channel>> | null;
} & ChannelsActions;
