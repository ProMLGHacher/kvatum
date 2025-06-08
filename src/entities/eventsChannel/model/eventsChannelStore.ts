import { create } from "zustand"
import { EventsChannelState } from "./types"
import { tokensDataStore } from "@/entities/tokensData"
import { $baseURL } from "@/shared/api/api"
import { websocketPinger } from "@/shared/lib/websocketPinger/websocketPinger"

export const eventsChannelStore = create<EventsChannelState>((set, get) => ({
  eventsChannel: null,
  isLoading: true,
  connect: async () => {
    set({ isLoading: true })
    const previousEventsChannel = get().eventsChannel
    if (previousEventsChannel) {
      previousEventsChannel.close()
    }
    try {
      const eventsChannel = new WebSocket($baseURL + "/ws/events")
      const controller = new AbortController()
      eventsChannel.addEventListener(
        "open",
        () => {
          eventsChannel.send(
            JSON.stringify({
              eventType: "Token",
              eventBody: tokensDataStore.getState().accessToken,
            }),
          )
          websocketPinger(eventsChannel, controller.signal)
          set({ eventsChannel })
        },
        { signal: controller.signal },
      )
      eventsChannel.addEventListener(
        "close",
        () => {
          console.log("close")
          set({ eventsChannel: null })
          controller.abort()
        },
        { signal: controller.signal },
      )
    } catch (error) {
      console.error(error)
    } finally {
      set({ isLoading: false })
    }
  },
  onMessage: (callback: (event: Record<string, unknown>) => void) => {
    get().eventsChannel?.addEventListener("message", (event) => {
      callback(JSON.parse(event.data))
    })
  },
  sendMessage: (message: Record<string, unknown>) => {
    const eventsChannel = get().eventsChannel
    if (!eventsChannel) return
    eventsChannel.send(JSON.stringify(message))
  },
  close: () => {
    get().eventsChannel?.close()
    set({ eventsChannel: null })
  },
}))
