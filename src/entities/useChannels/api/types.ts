import { WorkSpaceId } from "@/entities/useWorkSpcae"
import { ChannelId, ChannelType } from "../model/types"

export type ChannelsDto = {
    workspaceId: WorkSpaceId,
    chats: [
        {
            id: ChannelId,
            name: string,
            type: ChannelType
        }
    ]
}

