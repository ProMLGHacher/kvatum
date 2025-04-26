import { create } from "zustand"
import { ContextMenuStore } from "./types"
import { ContextMenuItem } from "@/shared/ui/ContextMenu"

export const contextMenuStore = create<ContextMenuStore>((set) => ({
  items: [],
  position: undefined,
  openContextMenu: (
    items: ContextMenuItem[],
    position: { x: number; y: number },
  ) => set({ items, position }),
  closeContextMenu: () => set({ items: [], position: undefined }),
}))
