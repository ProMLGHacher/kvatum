import { create } from "zustand";
import { WorkSpaceStore } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useWorkSpace = create<WorkSpaceStore>()(
  persist(
    (set) => ({
      workSpaces: null,
      setWorkSpaces: (workSpaces, hubId) =>
        set((state) => ({
          workSpaces: {
            ...state.workSpaces,
            [hubId]: workSpaces.reduce(
              (acc, workSpace) => ({ ...acc, [workSpace.id]: workSpace }),
              {}
            ),
          },
        })),
      addWorkSpace: (workSpace, hubId) => {
        set((state) => ({
          workSpaces: {
            [hubId]: {
              ...state.workSpaces?.[hubId],
              [workSpace.id]: workSpace,
            },
          },
        }));
      },
      clearWorkSpaces: (hubId) => set({ workSpaces: { [hubId]: null } }),
      removeWorkSpace: (workSpaceId, hubId) =>
        set((state) => ({
          workSpaces: {
            ...state.workSpaces,
            [hubId]: { ...state.workSpaces?.[hubId], [workSpaceId]: null },
          },
        })),
      updateWorkSpace: (workSpace, hubId) =>
        set((state) => ({
          workSpaces: {
            [hubId]: {
              ...state.workSpaces?.[hubId],
              [workSpace.id]: workSpace,
            },
          },
        })),
    }),
    {
      name: "workSpace",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
