
export type MediaStreamFields = {
    stream: MediaStream | null
    audio: boolean
    video: boolean
}


export type MediaStreamActions = {
    getMediaStream: () => Promise<void>
    switchAudio: () => void
    switchVideo: () => void
    stopMediaStream: () => void
}

export type MediaStreamState = MediaStreamFields & MediaStreamActions