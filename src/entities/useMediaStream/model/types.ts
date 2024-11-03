
export type MediaStreamFields = {
    stream: MediaStream | null
    hasAudio: boolean
    hasVideo: boolean
}


export type MediaStreamActions = {
    getMediaStream: (constraints?: MediaStreamConstraints) => Promise<void>
    muteAudio: () => void
    unmuteAudio: () => void
    stopVideo: () => void
    startVideo: () => void
    stopMediaStream: () => void
}

export type MediaStreamState = MediaStreamFields & MediaStreamActions