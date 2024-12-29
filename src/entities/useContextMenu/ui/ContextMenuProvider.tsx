import { ContextMenu } from "@/shared/ui/ContextMenu"
import { useContextMenu } from "../model/useContextMenu"

export type ContextMenuProviderProps = {
    children: React.ReactNode
}

export const ContextMenuProvider = ({ children }: ContextMenuProviderProps) => {
    const { items, position, closeContextMenu } = useContextMenu()

    return <>
        <ContextMenu items={items} position={position} onClose={closeContextMenu} />
        {children}
    </>
}