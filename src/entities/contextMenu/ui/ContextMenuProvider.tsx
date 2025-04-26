import { ContextMenu } from "@/shared/ui/ContextMenu"
import { contextMenuStore } from "../model/contextMenuStore"
import { useEffect } from "react"

export type ContextMenuProviderProps = {
  children: React.ReactNode
}

export const ContextMenuProvider = ({ children }: ContextMenuProviderProps) => {
  const { items, position, closeContextMenu } = contextMenuStore()

  useEffect(() => {
    window.addEventListener("contextmenu", (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
  }, [])

  return (
    <>
      <ContextMenu
        items={items}
        position={position}
        onClose={closeContextMenu}
      />
      {children}
    </>
  )
}
