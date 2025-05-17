import { RouteObject } from "react-router"
import { Route } from "./types"
import ProtectedRoute from "./ProtectedRoute"

export const processRoutes = (routes: Route[]): RouteObject[] => {
  return routes.map((route) => {
    return {
      path: route.path,
      element: (
        <ProtectedRoute
          element={route.element}
          roles={route.roles}
          redirect={route.redirect}
          key={route.path}
        />
      ),
      children: route.children ? processRoutes(route.children) : undefined,
    }
  })
}
