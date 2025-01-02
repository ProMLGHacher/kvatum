import { ServerState } from "./types";

import { create } from "zustand";

export const useServerState = create<ServerState>((set) => ({
    serverId: null,
    setServerId: (server) => set({ serverId: server }),
})) 