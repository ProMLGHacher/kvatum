// ProtectedRoute.tsx
import React from "react"
import { Navigate, useSearchParams } from "react-router-dom"
import { UserRole, userDataStore } from "@/entities/userData"

interface ProtectedRouteProps {
  element: React.ReactNode
  roles?: UserRole[]
  redirect?: string
  skeleton?: React.ReactNode
}

const ProtectedRoute = ({
  element,
  roles,
  redirect = "/main",
}: ProtectedRouteProps) => {
  const [searchParams] = useSearchParams()
  const redirectParam = searchParams.get("redirect")

  redirect = redirectParam || redirect
  const { role } = userDataStore()

  const userRole = role || UserRole.GUEST

  if (!roles) return element

  if (roles.includes(userRole)) return element

  return <Navigate to={redirect} replace />
}

export default ProtectedRoute
