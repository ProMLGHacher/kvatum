import { useConference } from "@/entities/useConference"
import { useTokensData } from "@/entities/useTokensData"
// import { useMediaStream } from "@/entities/useMediaStream"
import { useEffect } from "react"


export const ConferenceAudioProvider = ({ children }: { children: React.ReactNode }) => {

    const { isAuthorized } = useTokensData()

    if (!isAuthorized) return children

    const { peers } = useConference()


    useEffect(() => {
        if (!peers) return
        const audio = new Audio()
        const stream = new MediaStream()

        Object.values(peers).forEach(peer => {
            if (peer.state !== 'connected') return
            peer.stream?.getAudioTracks().forEach(track => {
                stream.addTrack(track)
            })
        })

        audio.srcObject = stream
        audio.play()

        return () => {
            audio.pause()
            audio.srcObject = null
            stream.getTracks().forEach(track => {
                track.stop()
                stream.removeTrack(track)
            })
        }
    }, [peers])

    return (
        <>
            {children}
        </>
    )
}
