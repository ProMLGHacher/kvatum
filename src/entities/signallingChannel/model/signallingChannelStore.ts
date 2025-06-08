import { create } from "zustand"
import { SignallingChannelState } from "./types"
import { tokensDataStore } from "@/entities/tokensData"
import { $baseURL } from "@/shared/api/api"
import { websocketPinger } from "@/shared/lib/websocketPinger/websocketPinger"

export const signallingChannelStore = create<SignallingChannelState>(
  (set, get) => ({
    signallingChannel: null,
    isLoading: true,
    connect: async () =>
      new Promise((resolve, reject) => {
        set({ isLoading: true })
        if (get().signallingChannel) {
          get().signallingChannel?.close()
        }
        try {
          const signallingChannel = new WebSocket($baseURL + "/ws/rooms")
          const controller = new AbortController()
          signallingChannel.addEventListener(
            "open",
            () => {
              signallingChannel.send(
                JSON.stringify({
                  eventType: "Token",
                  eventBody: tokensDataStore.getState().accessToken,
                }),
              )
              websocketPinger(signallingChannel, controller.signal)
              set({ signallingChannel })
              resolve()
            },
            { signal: controller.signal },
          )
          signallingChannel.addEventListener("close", () => {
            console.log("close")
            controller.abort()
            set({ signallingChannel: null })
            reject(new Error("Signalling channel closed"))
          })
        } catch (error) {
          console.error(error)
        } finally {
          set({ isLoading: false })
        }
      }),
    onMessage: (callback: (event: Record<string, unknown>) => void) => {
      get().signallingChannel?.addEventListener("message", (event) => {
        callback(JSON.parse(event.data))
      })
    },
    sendMessage: (message: Record<string, unknown>) => {
      const signallingChannel = get().signallingChannel
      if (!signallingChannel) return
      signallingChannel.send(JSON.stringify(message))
    },
    close: () => {
      get().signallingChannel?.close()
      set({ signallingChannel: null })
    },
  }),
)
