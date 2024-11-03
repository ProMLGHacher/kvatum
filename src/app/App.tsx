import { useEffect, useState } from "react"
import { AppRouter } from "./appRouter/AppRouter"
import { configureTokenInterceptors } from "./lib/initTokenInterceptor"
import { getUserAction } from "@/features/user/getUserAction/getUserAction"
import { ContextMenuProvider } from "@/entities/useContextMenu/ui/ContextMenuProvider"
import { getJoinedHubsAction } from "@/features/hubs/model/getJoinedHubs/getJoinedHubs"
import { ConfControlsProvider } from "@/widgets/ConfControlsProvider/ui/ConfControlsProvider"
import { useSignallingChannel } from "@/entities/useSignallingChannel"
import { configureConferenceSignallingChannel } from "@/features/conference/model/conferenceActionsts"
import { ConferenceAudioProvider } from "@/features/conference/ui/ConferenceAudioProvider/ConferenceAudioProvider"
import { useTokensData } from "@/entities/useTokensData"

export const App = () => {

  const [loading, setLoading] = useState(true)

  const { accessToken } = useTokensData()

  useEffect(() => {
    const init = async () => {
      configureTokenInterceptors()
      try {
        await getUserAction()
      } catch (error) {
        setLoading(false)
      }
    }
    init()
  }, [])

  useEffect(() => {
    if (!accessToken) return
    const init = async () => {
      await useSignallingChannel.getState().connect()
      configureConferenceSignallingChannel()
      Promise.all([getJoinedHubsAction()]).finally(() => setLoading(false))
    }
    init()
  }, [accessToken])

  if (loading) {
    return <div style={{ color: 'white' }}>Гружу приложение...</div>
  }

  return (
    <ContextMenuProvider>
      <ConfControlsProvider>
        <ConferenceAudioProvider>
          <AppRouter />
        </ConferenceAudioProvider>
      </ConfControlsProvider>
    </ContextMenuProvider>
  )
}
