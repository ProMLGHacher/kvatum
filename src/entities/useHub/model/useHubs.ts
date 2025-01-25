import { create } from "zustand";
import { HubStore } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useHubs = create<HubStore>()(
  persist(
    (set) => ({
      hubs: null,
      setHubs: (hubs) => {
        if (!hubs) {
          set({ hubs: null });
          return;
        }
        if (hubs.length === 0) {
          set({ hubs: null });
          return;
        }
        const newHubs = hubs.reduce(
          (acc, hub) => ({ ...acc, [hub.id]: hub }),
          {}
        );
        set({ hubs: newHubs });
      },
      clearHubs: () => set({ hubs: null }),
      addHub: (hub) =>
        set((state) => ({
          hubs: state.hubs
            ? { ...state.hubs, [hub.id]: hub }
            : { [hub.id]: hub },
        })),
      removeHub: (hubId) =>
        set((state) => {
          const newHubs = { ...state.hubs };
          delete newHubs[hubId];
          return { hubs: newHubs };
        }),
      updateHub: (hub) =>
        set((state) => ({
          hubs: { ...state.hubs, [hub.id]: hub },
        })),
    }),
    {
      name: "hubs",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
