
export type ConferenceUser = {
    email: string
    id: string
    images: string[]
    nickname: string
    role: string
    isMicroMuted: boolean
    hasVideo: boolean
}

export type PeerConnection = {
    id: string,
    state: 'pending' | 'connected',
    pc: RTCPeerConnection,
    stream: MediaStream | null,
    volume: number,
    user: ConferenceUser
}

export type PeerConnections = Record<string, PeerConnection>

export type ConferenceActions = {
    setPeerConnections: (peerConnection: PeerConnections) => void,
    removePeerConnection: (id: string) => void,
    addPeerConnection: (peerConnection: PeerConnection) => void,
    addPeerConnectionStreamTrack: (id: string, track: MediaStreamTrack) => void,
    clearPeerConnections: () => void,
    setUserVolume: (volume: number, id: string) => void,
    setUserMuted: (muted: boolean, id: string) => void,
    setUserCamera: (camera: boolean, id: string) => void,
    setRoomId: (roomId: string) => void,
    disconnectFromConference: () => void,
    setPeerConnectionState: (id: string, newState: 'pending' | 'connected') => void,
}

export type Conference = {
    roomId: string | null,
    peers: PeerConnections | null
} & ConferenceActions