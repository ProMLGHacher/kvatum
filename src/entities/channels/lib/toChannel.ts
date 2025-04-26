import { ChannelsDto } from "../api/types"
import { Channel } from "../model/types"

export const toChannels = (dto: ChannelsDto): Channel[] => {
  return dto.chats.map((chat) => ({
    id: chat.id,
    name: chat.name,
    type: chat.type,
  }))
}
