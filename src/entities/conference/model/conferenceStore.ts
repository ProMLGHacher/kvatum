import { create } from "zustand"
import { Conference } from "./types"

// ^(?!.*(?:Ping|Pong)).*$
// в инспекторе вставить этот регекс чтобы убрать пинг и понг из логов

export const conferenceStore = create<Conference>((set, get) => ({
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
    set((state) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { [id]: _, ...newState } = state.peers!
      return {
        peers: newState,
        microState: { ...state.microState, [id]: false },
        videoState: { ...state.videoState, [id]: false },
      }
    })
  },
  addPeerConnection: (peerConnection) => {
    console.log(peerConnection)
    set((state) => {
      if (!state.peers)
        return {
          peers: { [peerConnection.id]: peerConnection },
          microState: {
            [peerConnection.id]: !peerConnection.user.isMicroMuted,
          },
          videoState: { [peerConnection.id]: peerConnection.user.hasVideo },
        }
      return {
        peers: { ...state.peers, [peerConnection.id]: peerConnection },
        microState: {
          ...state.microState,
          [peerConnection.id]: peerConnection.user.isMicroMuted,
        },
        videoState: {
          ...state.videoState,
          [peerConnection.id]: peerConnection.user.hasVideo,
        },
      }
    })
  },
  setPeerConnectionAudioTrack: (id, track) => {
    if (!get().peers) return
    set((state) => {
      return {
        peers: {
          ...state.peers,
          [id]: { ...state.peers![id], audioTrack: track },
        },
        microState: {
          ...state.microState,
          [id]: !state.peers![id].user.isMicroMuted,
        },
      }
    })
  },
  setPeerConnectionVideoTrack: (id, track) => {
    if (!get().peers) return
    set((state) => {
      return {
        peers: {
          ...state.peers,
          [id]: { ...state.peers![id], videoTrack: track },
        },
      }
    })
  },
  clearPeerConnections: () => {
    set({ peers: null })
    set({ microState: {}, videoState: {} })
  },
  setUserVolume: (volume, id) =>
    set((state) => {
      if (!state.peers) return { peers: null }
      return { peers: { ...state.peers, [id]: { ...state.peers[id], volume } } }
    }),
  setUserMuted: (muted, id) => {
    if (!get().peers) return
    set((state) => {
      return { microState: { ...state.microState, [id]: !muted } }
    })
  },
  setUserCamera: (camera, id) => {
    if (!get().peers) return
    if (camera) {
      set((state) => {
        return { videoState: { ...state.videoState, [id]: camera } }
      })
    } else {
      set((state) => {
        return {
          peers: {
            ...state.peers,
            [id]: { ...state.peers![id], videoTrack: null },
          },
          videoState: { ...state.videoState, [id]: camera },
        }
      })
    }
  },
  setRoomId: (roomId) => set({ roomId }),
  setPeerConnectionState: (id: string, newState: "pending" | "connected") =>
    set((state) => {
      if (!state.peers) return { peers: null }
      return {
        peers: {
          ...state.peers,
          [id]: { ...state.peers[id], state: newState },
        },
      }
    }),
  disconnectFromConference: () => {
    const peers = get().peers
    if (!peers) return
    Object.values(peers).forEach((peer) => {
      peer.pc.close()
    })
    set({ peers: null })
    set({ roomId: null })
  },
}))
