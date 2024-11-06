import { HubId, useHubs } from "@/entities/useHub";
import { setCurrentHubAction } from "@/features/hubs/model/setCurrentHub/setCurrentHub";
import { useEffect } from "react";
import { Navigate, Outlet, useParams } from "react-router-dom";

export const HubsPage = () => {

    // const { hubsList } = useHubs()
    const { hubId } = useParams()

    useEffect(() => {
        if (hubId) {
            setCurrentHubAction(hubId as HubId)
        }
    }, [hubId])

    if (!hubId) {
        return <div>HubsPage</div>
    }

    // const hub = hubsList?.find(hub => hub.id === hubId)

    // if (!hub) {
    //     return <Navigate to='/main/' />
    // }

    return <Outlet />
}
