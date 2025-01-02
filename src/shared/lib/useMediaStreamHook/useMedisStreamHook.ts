import { useState } from "react"

export const useMediaStreamHook = (defaultConstraints: MediaStreamConstraints = { video: true, audio: true }) => {

    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isMuted, setIsMuted] = useState(false)
    const [isPausedVideo, setIsPausedVideo] = useState(false)

    const getMediaStream = async (constraints: MediaStreamConstraints = defaultConstraints) => {
        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
        setStream(mediaStream)
    }

    const muteAudio = () => {
        stream?.getAudioTracks().forEach((track) => track.enabled = false)
        setIsMuted(true)
    }

    const unmuteAudio = () => {
        stream?.getAudioTracks().forEach((track) => track.enabled = true)
        setIsMuted(false)
    }

    const pauseVideo = () => {
        stream?.getVideoTracks().forEach((track) => track.enabled = false)
        setIsPausedVideo(true)
    }

    const resumeVideo = () => {
        stream?.getVideoTracks().forEach((track) => track.enabled = true)
        setIsPausedVideo(false)
    }

    return { stream, getMediaStream, muteAudio, unmuteAudio, isMuted, pauseVideo, resumeVideo, isPausedVideo }
}