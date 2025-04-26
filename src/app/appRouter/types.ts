import { UserRole } from "@/entities/userData"

export type Route = {
  path: string
  element: React.ReactNode
  roles?: UserRole[]
  children?: Route[]
  redirect?: string
}
