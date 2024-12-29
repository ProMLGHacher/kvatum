import { create } from "zustand";
import { Conference } from "./types";


export const useConference = create<Conference>((set, get) => ({
    roomId: null,
    peers: null,
    microState: {},
    videoState: {},
    setPeerConnections: (peerConnections) => {
        set({ peers: peerConnections })
        Object.entries(peerConnections).forEach(([id, peer]) => {
            get().microState[id] = !peer.user.isMicroMuted
            get().videoState[id] = peer.user.hasVideo
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
        get().microState[peerConnection.id] = !peerConnection.user.isMicroMuted
        get().videoState[peerConnection.id] = peerConnection.user.hasVideo
    },
    setPeerConnectionAudioTrack: (id, track) => {
        if (!get().peers) return
        set(state => {
            return {
                peers: { ...state.peers, [id]: { ...state.peers![id], audioTrack: track } }
            }
        })
    },
    setPeerConnectionVideoTrack: (id, track) => {
        if (!get().peers) return
        set(state => {
            return {
                peers: { ...state.peers, [id]: { ...state.peers![id], videoTrack: track } }
            }
        })
    },
    clearPeerConnections: () => {
        set({ peers: null })
        set({ microState: {}, videoState: {} })
    },
    setUserVolume: (volume, id) => set(state => {
        if (!state.peers) return { peers: null }
        return { peers: { ...state.peers, [id]: { ...state.peers[id], volume } } }
    }),
    setUserMuted: (muted, id) => {
        if (!get().peers) return
        set(state => {
            return { microState: { ...state.microState, [id]: !muted } }
        })
    },
    setUserCamera: (camera, id) => {
        if (!get().peers) return
        if (camera) {
            set(state => {
                return { videoState: { ...state.videoState, [id]: camera } }
            })
        } else {
            set(state => {
                return {
                    peers: { ...state.peers, [id]: { ...state.peers![id], videoTrack: null } },
                    videoState: { ...state.videoState, [id]: camera }
                }
            })
        }
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