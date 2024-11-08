import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { MediaStreamState } from './types'

export const useMediaStream =
    create<MediaStreamState>()(
        subscribeWithSelector((set, get) => ({
            stream: null,
            hasAudio: false,
            hasVideo: false,
            getMediaStream: async (constraints: MediaStreamConstraints = { video: false, audio: true }) => {
                try {
                    console.log(navigator.mediaDevices);
                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
                    set({ stream: mediaStream, hasAudio: mediaStream.getAudioTracks().length > 0, hasVideo: mediaStream.getVideoTracks().length > 0 })
                } catch (error) {
                    console.error(error)
                }
            },
            muteAudio: () => set((state) => {
                if (!state.hasAudio) return state
                state.stream?.getAudioTracks().forEach((track) => track.enabled = false)
                return { hasAudio: false }
            }),
            unmuteAudio: () => set((state) => {
                if (state.hasAudio) return state
                state.stream?.getAudioTracks().forEach((track) => track.enabled = true)
                return { hasAudio: true }
            }),
            stopVideo: async () => {
                if (get().hasVideo) {
                    get().stream?.getVideoTracks().forEach(track => track.stop())
                    set({ hasVideo: false })
                }
            },
            startVideo: async () => {
                if (!get().hasVideo) {
                    get().stream?.getTracks().forEach(track => track.stop())

                    const constraints = { video: true, audio: true }
                    const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)

                    set({ stream: mediaStream, hasAudio: mediaStream.getAudioTracks().length > 0, hasVideo: mediaStream.getVideoTracks().length > 0 })
                }
            },
            stopMediaStream: async () => {
                get().stream?.getTracks().forEach(track => track.stop())
                set({ stream: null, hasAudio: false, hasVideo: false })
            }
        }))
    )