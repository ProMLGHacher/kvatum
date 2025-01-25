import { workSpaceApi } from "@/entities/useWorkSpcae/api/workSpaceApi"
import { CreateWorkSpaceBody } from "@/entities/useWorkSpcae/api/types"
import { useWorkSpace } from "@/entities/useWorkSpcae"
import { getChannelsAction } from "@/features/channels"

export const createWorkSpaceAction = async (newWorkSpace: CreateWorkSpaceBody) => {
    const workSpace = await workSpaceApi.createWorkSpace(newWorkSpace)
    await getChannelsAction(workSpace.id)
    useWorkSpace.getState().addWorkSpace(workSpace, newWorkSpace.hubId)
}