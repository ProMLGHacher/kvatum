
export type ConferenceUser =  {
    id: string
    name: string
    muted: boolean
    camera: boolean
    avatar: string
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
    setPeerConnectionStream: (id: string, stream: MediaStream | null) => void,
    clearPeerConnections: () => void,
    setUserVolume: (volume: number, id: string) => void,
    setUserMuted: (muted: boolean, id: string) => void,
    setUserCamera: (camera: boolean, id: string) => void,
    setRoomId: (roomId: string) => void,
    setPeerConnectionState: (id: string, newState: 'pending' | 'connected') => void,
}

export type Conference = { 
    roomId: string | null,
    peers: PeerConnections | null 
} & ConferenceActions