import { conferenceStore } from "@/entities/conference"
import { tokensDataStore } from "@/entities/tokensData"
// import { mediaStreamStore } from "@/entities/mediaStreamStore"
import { useEffect } from "react"

export const ConferenceAudioProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const { accessToken, refreshToken } = tokensDataStore()

  if (!accessToken || !refreshToken) return children

  const { peers } = conferenceStore()

  useEffect(() => {
    if (!peers) return
    const audio = new Audio()
    const stream = new MediaStream()

    Object.values(peers).forEach((peer) => {
      if (peer.state !== "connected") return
      if (!peer.audioTrack) return
      stream.addTrack(peer.audioTrack)
    })

    audio.srcObject = stream
    audio.play()

    return () => {
      audio.pause()
      audio.srcObject = null
    }
  }, [peers])

  return children
}
