import { create } from 'zustand'
import { SignallingChannelState } from './types'
import { useTokensData } from '@/entities/useTokensData'
import { $baseURL } from '@/shared/api/api'
import { websocketPinger } from '@/shared/lib/websocketPinger/websocketPinger'

export const useSignallingChannel = create<SignallingChannelState>((set, get) => ({
    signallingChannel: null,
    isLoading: true,
    connect: async () => {
        set({ isLoading: true })
        try {
            const signallingChannel = new WebSocket($baseURL + '/ws/rooms')
            const controller = new AbortController()
            await new Promise((resolve) => {
                signallingChannel.onopen = () => {
                    signallingChannel.send(JSON.stringify({
                        "eventType": "Token",
                        "eventBody": useTokensData.getState().accessToken
                    }))
                    websocketPinger(signallingChannel, controller)
                    set({ signallingChannel })
                    resolve(true)
                }
            })
            signallingChannel.addEventListener('close', () => {
                console.log('close')
                controller.abort()
                set({ signallingChannel: null })
            })
        } catch (error) {
            console.error(error)
        } finally {
            set({ isLoading: false })
        }
    },
    onMessage: (callback: (event: Record<string, any>) => void) => {
        get().signallingChannel?.addEventListener('message', (event) => {
            callback(JSON.parse(event.data))
        })
    },
    sendMessage: (message: Record<string, any>) => {
        const signallingChannel = get().signallingChannel
        if (!signallingChannel) return
        signallingChannel.send(JSON.stringify(message))
    },
    removeMessageListener: (callback: (event: Record<string, any>) => void) => {
        get().signallingChannel?.removeEventListener('message', (event) => {
            callback(JSON.parse(event.data))
        })
    },
    close: () => {
        get().signallingChannel?.close()
        set({ signallingChannel: null })
    }
}))