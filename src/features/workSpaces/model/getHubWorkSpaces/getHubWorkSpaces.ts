import { HubId } from "@/entities/useHub"
import { useWorkSpace } from "@/entities/useWorkSpcae"
import { workSpaceApi } from "@/entities/useWorkSpcae/api/workSpaceApi"

export const getHubWorkSpacesAction = async (hubId: HubId) => {
    const workSpaces = await workSpaceApi.getWorkSpaceList(hubId)
    useWorkSpace.getState().setWorkSpaceList(workSpaces)
    useWorkSpace.getState().setCurrentWorkSpace(workSpaces[0])
}