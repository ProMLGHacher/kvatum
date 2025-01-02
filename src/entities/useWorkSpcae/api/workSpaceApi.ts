import { $api } from "@/shared/api/api"
import { CreateWorkSpaceBody, WorkSpaceDto } from "./types"
import { WorkSpace } from "../model/types"
import { toWorkSpace } from "../lib/toWorkSpace"
import { HubId } from "@/entities/useHub"

export const workSpaceApi = {
    getWorkSpaceList: async (hubId: HubId): Promise<WorkSpace[]> => {
        const response = await $api.get<WorkSpaceDto[]>(`/api/workspaces`, { params: { hubId, limit: 100, offset: 0 } })
        return response.data.map(toWorkSpace)
    },
    createWorkSpace: async (workSpace: CreateWorkSpaceBody): Promise<WorkSpace> => {
        const response = await $api.post<WorkSpaceDto>("/api/workspace", workSpace)
        return toWorkSpace(response.data)
    }
}