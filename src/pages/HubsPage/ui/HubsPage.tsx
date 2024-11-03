import { useHubs } from "@/entities/useHub";
import { Navigate, Outlet, useParams } from "react-router-dom";

export const HubsPage = () => {

    const { hubsList } = useHubs()
    const { hubId } = useParams()

    if (!hubId) {
        return <div>HubsPage</div>
    }

    const hub = hubsList?.find(hub => hub.id === hubId)

    if (!hub) {
        return <Navigate to='/main/' />
    }

    return <Outlet />
}
