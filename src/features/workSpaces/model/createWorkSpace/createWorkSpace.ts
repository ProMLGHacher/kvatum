import { workSpaceApi } from "@/entities/workSpcae/api/workSpaceApi"
import { CreateWorkSpaceBody } from "@/entities/workSpcae/api/types"
import { workSpaceStore } from "@/entities/workSpcae"
import { getChannelsAction } from "@/features/channels"

export const createWorkSpaceAction = async (
  newWorkSpace: CreateWorkSpaceBody,
) => {
  const workSpace = await workSpaceApi.createWorkSpace(newWorkSpace)
  workSpaceStore.getState().addWorkSpace(workSpace, newWorkSpace.hubId)
  await getChannelsAction(workSpace.id)
}
