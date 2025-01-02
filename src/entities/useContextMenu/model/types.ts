import { ContextMenuItem } from "@/shared/ui/ContextMenu"

export type ContextMenuStore = {
    items: ContextMenuItem[],
    position: {
        x: number,
        y: number,
    } | undefined,
    openContextMenu: (items: ContextMenuItem[], position: { x: number, y: number }) => void,
    closeContextMenu: () => void,
}