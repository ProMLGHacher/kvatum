import { create } from "zustand";
import { ChannelsStore } from "./types";

export const useChannels = create<ChannelsStore>((set) => ({
  channels: null,
  setChannels: (channels, workSpaceId) =>
    set((state) => ({
      ...state,
      channels: {
        ...state.channels,
        [workSpaceId]: channels.reduce(
          (acc, channel) => ({ ...acc, [channel.id]: channel }),
          {}
        ),
      },
    })),
  clearChannels: (workSpaceId) =>
    set((state) => ({
      ...state,
      channels: { ...state.channels, [workSpaceId]: undefined },
    })),
}));
