import { workSpaceApi } from "@/entities/useWorkSpcae/api/workSpaceApi"
import { CreateWorkSpaceBody } from "@/entities/useWorkSpcae/api/types"
import { useWorkSpace } from "@/entities/useWorkSpcae"

export const createWorkSpaceAction = async (newWorkSpace: CreateWorkSpaceBody) => {
    const workSpace = await workSpaceApi.createWorkSpace(newWorkSpace)
    useWorkSpace.getState().addWorkSpace(workSpace)
}