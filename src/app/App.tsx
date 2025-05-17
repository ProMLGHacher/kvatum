import { useEffect, useState } from "react"
import { AppRouter } from "./appRouter/AppRouter"
import { configureTokenInterceptors } from "./lib/initTokenInterceptor"
import { getUserAction } from "@/features/user/getUserAction/getUserAction"
import { ContextMenuProvider } from "@/entities/contextMenu/ui/ContextMenuProvider"
import { ConfControlsProvider } from "@/widgets/ConfControlsProvider/ui/ConfControlsProvider"
import { signallingChannelStore } from "@/entities/signallingChannel"
import { configureConferenceSignallingChannel } from "@/features/conference/model/conferenceActionsts"
import { ConferenceAudioProvider } from "@/features/conference/ui/ConferenceAudioProvider/ConferenceAudioProvider"
import { tokensDataStore } from "@/entities/tokensData"
import { initHubsDataAction } from "@/features/hubs/model/initHubsData/initHubsData"
import { eventsChannelStore } from "@/entities/eventsChannel"
import { AppEventsProvider } from "@/process/appEventsProvider"
import { mediaStreamStore } from "@/entities/mediaStream"
import { ToastProvider } from "@/shared/ui/Toast/ui/ToastProvider"
import { toast as toastFunction } from "@/shared/ui/Toast/model/toast"

globalThis.toast = toastFunction

export const App = () => {
  const [loading, setLoading] = useState(true)

  const { accessToken, refreshToken } = tokensDataStore()

  useEffect(() => {
    const init = async () => {
      configureTokenInterceptors()
      mediaStreamStore.getState().init()
      try {
        await getUserAction()
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (!(accessToken && refreshToken)) {
      signallingChannelStore.getState().close()
      eventsChannelStore.getState().close()
      return
    }
    const init = async () => {
      await initHubsDataAction()
      try {
        await signallingChannelStore.getState().connect()
      } catch (error) {
        console.log(error)
      }
      try {
        await eventsChannelStore.getState().connect()
      } catch (error) {
        console.log(error)
      }
      configureConferenceSignallingChannel()
      setLoading(false)
    }
    init()
  }, [accessToken, refreshToken])

  if (loading) {
    return <div style={{ color: "white" }}>Гружу приложение...</div>
  }

  return (
    <ToastProvider>
      <AppEventsProvider>
        <ContextMenuProvider>
          <ConfControlsProvider>
            <ConferenceAudioProvider>
              <AppRouter />
            </ConferenceAudioProvider>
          </ConfControlsProvider>
        </ContextMenuProvider>
      </AppEventsProvider>
    </ToastProvider>
  )
}
