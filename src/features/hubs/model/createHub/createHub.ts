import { hubsApi } from "@/entities/useHub/api/hubsApi"
import { useHubs } from "@/entities/useHub"
import { CreateHubBody } from "@/entities/useHub/api/types"

export const createHubAction = async (newHub: CreateHubBody) => {
    const hub = await hubsApi.createHub(newHub)
    useHubs.getState().addHub(hub)
}