

export type SignallingChannel = {
    signallingChannel: WebSocket | null
    isLoading: boolean
}

export type SignallingChannelActions = {
    connect: () => Promise<void>
    onMessage: (callback: (event: Record<string, any>) => void) => void
    sendMessage: (message: Record<string, any>) => void
    removeMessageListener: (callback: (event: Record<string, any>) => void) => void
    close: () => void
}

export type SignallingChannelState = SignallingChannel & SignallingChannelActions