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

  const { isAuthorized, accessToken, refreshToken } = useTokensData()

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
    if (!(accessToken && refreshToken)) return
    const init = async () => {
      Promise.all([getJoinedHubsAction()]).catch((e) => {
        console.error(e)
      }).finally(() => setLoading(false))
      await useSignallingChannel.getState().connect()
      configureConferenceSignallingChannel()

    }
    init()
  }, [accessToken, refreshToken])

  if (loading) {
    return <div style={{ color: 'white' }}>
      <p>{JSON.stringify({
        isAuthorized,
        accessToken,
        refreshToken,
      })}</p>
      Гружу приложение...</div>
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
