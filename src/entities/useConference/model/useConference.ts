import { create } from "zustand";
import { Conference } from "./types";


export const useConference = create<Conference>((set, get) => ({
    roomId: null,
    peers: null,
    mediaStreamState: new Map(),
    setPeerConnections: (peerConnections) => {
        set({ peers: peerConnections })
        Object.entries(peerConnections).forEach(([id, peer]) => {
            get().mediaStreamState.set(id, { hasAudio: !peer.user.isMicroMuted, hasVideo: peer.user.hasVideo })
        })
    },
    removePeerConnection: (id) => {
        if (!get().peers) return
        set(state => {
            const { [id]: _, ...newState } = state.peers!
            return { peers: newState }
        })
    },
    addPeerConnection: (peerConnection) => {
        set(state => {
            if (!state.peers) return { peers: { [peerConnection.id]: peerConnection } }
            return { peers: { ...state.peers, [peerConnection.id]: peerConnection } }
        })
        get().mediaStreamState.set(peerConnection.id, { hasAudio: !peerConnection.user.isMicroMuted, hasVideo: peerConnection.user.hasVideo })
    },
    addPeerConnectionStreamTrack: (id, track) => {
        if (!get().peers) return
        get().peers![id].stream?.addTrack(track)
    },
    clearPeerConnections: () => {
        set({ peers: null })
        get().mediaStreamState.clear()
    },
    setUserVolume: (volume, id) => set(state => {
        if (!state.peers) return { peers: null }
        return { peers: { ...state.peers, [id]: { ...state.peers[id], volume } } }
    }),
    setUserMuted: (muted, id) => {
        get().mediaStreamState.set(id, { hasAudio: !muted, hasVideo: get().mediaStreamState.get(id)?.hasVideo || false })
    },
    setUserCamera: (camera, id) => {
        get().mediaStreamState.set(id, { hasAudio: get().mediaStreamState.get(id)?.hasAudio || false, hasVideo: camera })
    },
    setRoomId: (roomId) => set({ roomId }),
    setPeerConnectionState: (id: string, newState: 'pending' | 'connected') => set(state => {
        if (!state.peers) return { peers: null }
        return {
            peers: {
                ...state.peers,
                [id]: { ...state.peers[id], state: newState }
            }
        }
    }),
    disconnectFromConference: () => {
        const peers = get().peers
        if (!peers) return
        Object.values(peers).forEach(peer => {
            peer.pc.close()
        })
        set({ peers: null })
        set({ roomId: null })
    }
}))