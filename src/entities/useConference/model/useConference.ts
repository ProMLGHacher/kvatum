import { create } from "zustand";
import { Conference } from "./types";


export const useConference = create<Conference>((set, get) => ({
    roomId: null,
    peers: null,
    setPeerConnections: (peerConnections) => set({ peers: peerConnections }),
    removePeerConnection: (id) => set(state => {
        if (!state.peers) return { peers: null }
        const { [id]: _, ...newState } = state.peers
        return { peers: newState }
    }),
    addPeerConnection: (peerConnection) => set(state => {
        if (!state.peers) return { peers: { [peerConnection.id]: peerConnection } }
        return { peers: { ...state.peers, [peerConnection.id]: peerConnection } }
    }),
    addPeerConnectionStreamTrack: (id, track) => {
        if (!get().peers) return
        get().peers![id].stream?.addTrack(track)
    },
    clearPeerConnections: () => set({ peers: null }),
    setUserVolume: (volume, id) => set(state => {
        if (!state.peers) return { peers: null }
        return { peers: { ...state.peers, [id]: { ...state.peers[id], volume } } }
    }),
    setUserMuted: (muted, id) => set(state => {
        if (!state.peers) return { peers: null }
        return { peers: { ...state.peers, [id]: { ...state.peers[id], muted } } }
    }),
    setUserCamera: (camera, id) => set(state => {
        if (!state.peers) return { peers: null }
        return { peers: { ...state.peers, [id]: { ...state.peers[id], camera } } }
    }),
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
}))