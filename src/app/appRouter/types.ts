import { UserRole } from "@/entities/useUserData"

export type Route = {
    path: string
    element: React.ReactNode
    roles?: UserRole[],
    children?: Route[],
    redirect?: string
}