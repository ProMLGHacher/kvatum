import { useConference } from "@/entities/useConference"
// import { useMediaStream } from "@/entities/useMediaStream"
import { useEffect } from "react"


export const ConferenceAudioProvider = ({ children }: { children: React.ReactNode }) => {

    const { peers } = useConference()

    // const { stream: localStream } = useMediaStream()

    // useEffect(() => {
    //     if (!localStream) return
    //     const audio = new Audio()
    //     const stream = new MediaStream()
        
    //     localStream.getTracks().forEach(track => {
    //         if (track.kind === 'audio') {
    //             stream.addTrack(track)
    //         }
    //     })
    //     audio.srcObject = stream
    //     audio.play()

    //     return () => {
    //         audio.pause()
    //         audio.srcObject = null
    //         localStream.getTracks().forEach(track => {
    //             track.stop()
    //             localStream.removeTrack(track)
    //         })
    //     }
    // }, [localStream])

    useEffect(() => {
        if (!peers) return
        const audio = new Audio()
        const stream = new MediaStream()

        Object.values(peers).forEach(peer => {
            if (peer.state !== 'connected') return
            peer.stream?.getAudioTracks().forEach(track => {
                if (track.kind === 'audio') {
                    stream.addTrack(track)
                }
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
