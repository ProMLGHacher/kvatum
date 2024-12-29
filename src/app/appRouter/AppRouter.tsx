import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { processRoutes } from "./processRoutes";
import { routes } from "./routes";

const router = createBrowserRouter([
    ...processRoutes(routes),
    {
        path: '*',
        element: <Navigate to='/' />
    }
])

export const AppRouter = () => {
    return <RouterProvider router={router} />
}