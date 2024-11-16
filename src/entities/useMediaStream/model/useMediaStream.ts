import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'
import { MediaStreamState } from './types'

export const useMediaStream =
    create<MediaStreamState>()(
        subscribeWithSelector((set, get) => ({
            stream: new MediaStream(),
            audio: false,
            video: false,
            getMediaStream: async () => {
                try {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: get().video })
                    mediaStream?.getAudioTracks().forEach(track => track.enabled = get().audio)
                    mediaStream?.getTracks().forEach(track => get().stream?.addTrack(track))
                } catch (error) {
                    console.error(error)
                }
            },
            switchAudio: () => {
                get().stream?.getAudioTracks().forEach(track => track.enabled = !get().audio)
                set(state => ({ audio: !state.audio }))
            },
            switchVideo: async () => {
                if (!get().stream) return
                if (get().video) {
                    get().stream?.getVideoTracks().forEach(track => {
                        track.stop()
                        get().stream?.removeTrack(track)
                    })
                    set({ video: false })
                } else {
                    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true })
                    mediaStream.getVideoTracks().forEach(track => get().stream?.addTrack(track))
                    set({ video: true })
                }
            },
            stopMediaStream: async () => {
                get().stream?.getTracks().forEach(track => {
                    track.stop()
                    get().stream?.removeTrack(track)
                })
                set({ stream: new MediaStream() })
            }
        }))
    )