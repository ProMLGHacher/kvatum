export type ChannelId = Brand<string, 'ChannelId'>

export type ChannelType = 'Conference' | 'Chat' | 'Channel'

export type Channel = {
    id: ChannelId,
    name: string,
    type: ChannelType
}

export type ChannelsActions = {
    setChannels: (channels: Channel[]) => void,
    clearChannels: () => void
}

export type ChannelsStore = {
    channels: Channel[] | null,
} & ChannelsActions
