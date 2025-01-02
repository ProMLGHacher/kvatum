import { create } from "zustand";
import { ChannelsStore } from "./types";

export const useChannels = create<ChannelsStore>((set) => ({
    channels: null,
    setChannels: (channels) => set({ channels }),
    clearChannels: () => set({ channels: null }),
}))
