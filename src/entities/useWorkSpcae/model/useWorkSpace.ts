import { create } from "zustand";
import { WorkSpaceStore } from "./types";
import { createJSONStorage, persist } from "zustand/middleware";

export const useWorkSpace = create<WorkSpaceStore>()(persist((set) => ({
    workSpaceList: null,
    currentWorkSpace: null,
    setWorkSpaceList: (workSpaceList) => set({ workSpaceList }),
    setCurrentWorkSpace: (workSpace) => set({ currentWorkSpace: workSpace }),
    addWorkSpace: (workSpace) => set((state) => ({ workSpaceList: state.workSpaceList ? state.workSpaceList.concat(workSpace) : [workSpace] })),
    clearWorkSpace: () => set({ currentWorkSpace: null, workSpaceList: null }),
}),
    {
        name: 'workSpace',
        storage: createJSONStorage(() => localStorage)
    }
))
