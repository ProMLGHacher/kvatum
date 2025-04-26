export type ContextMenuItem = {
  id: string
  text: string
  type?: "checkbox" | "text"
  icon?: React.ReactNode
  disabled?: boolean
  danger?: boolean
  checked?: boolean
  subContent?: React.ReactNode
  children?: ContextMenuItem[]
  onClick: (e?: boolean) => void
}
