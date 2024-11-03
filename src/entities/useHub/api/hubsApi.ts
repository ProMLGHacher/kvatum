import { $api } from "@/shared/api/api"
import { CreateHubBody, HubDto } from "./types"
import { toHub } from "../lib/toHub"
import { Hub } from "../model/types"

export const hubsApi = {
    getJoinedHubs: async (): Promise<Hub[]> => {
        const response = await $api.get<HubDto[]>("/api/hubs/me")
        return response.data.map(toHub)
    },
    createHub: async (newHub: CreateHubBody): Promise<Hub> => {
        const response = await $api.post<HubDto>("/api/hub", newHub)
        return toHub(response.data)
    },
    createHubInvite: async (hubId: string): Promise<string> => {
        const response = await $api.get<{ link: string }>(`/api/hub/link/${hubId}`)
        return response.data.link
    },
    acceptInvite: async (inviteHash: string): Promise<void> => {
        await $api.post(`/api/hub/invitation`, undefined, {
            params: {
                hash: inviteHash
            }
        })
    }
}
