import { useChannels } from "@/entities/useChannels/model/useChannels"
import { HubId } from "@/entities/useHub"
import { useHubs } from "@/entities/useHub"
import { useWorkSpace } from "@/entities/useWorkSpcae"
import { getHubWorkSpacesAction } from "@/features/workSpaces/model/getHubWorkSpaces/getHubWorkSpaces"

export const setCurrentHubAction = async (hubId: HubId) => {
    useHubs.getState().setCurrentHub(hubId)
    useWorkSpace.getState().clearWorkSpace()
    useChannels.getState().clearChannels()
    await getHubWorkSpacesAction(hubId)
}