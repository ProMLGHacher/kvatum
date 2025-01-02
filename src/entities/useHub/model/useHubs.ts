import { create } from "zustand";
import { HubStore } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useHubs = create<HubStore>()(
    persist(
        (set) => ({
            currentHub: null,
            hubsList: null,
            setHubsList: (hubs) => set({ hubsList: hubs }),
            clearHubsList: () => set({ hubsList: null }),
            addHub: (hub) => set((state) => ({ hubsList: state.hubsList ? state.hubsList.concat(hub) : [hub] })),
            setCurrentHub: (hubId) => set((state) => ({ currentHub: state.hubsList?.find((hub) => hub.id === hubId) })),
        }),
        {
            name: 'hubs',
            storage: createJSONStorage(() => sessionStorage),
        }
    )
)
