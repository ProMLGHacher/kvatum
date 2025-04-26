import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

// name must be unique
export type AudioEffect = {
  effect: (
    audioContext: AudioContext,
    source: MediaStreamAudioSourceNode,
  ) => AudioNode
  node?: AudioNode
  name: string
}

// name must be unique
export type VideoEffect = {
  effect: (ctx: CanvasRenderingContext2D | null) => void
  node?: HTMLCanvasElement
  name: string
}

type MediaStreamState = {
  stream: MediaStream
  audio: boolean
  video: boolean
  selectedAudioDevice: MediaDeviceInfo | null
  selectedVideoDevice: MediaDeviceInfo | null
  audioDevices: MediaDeviceInfo[]
  videoDevices: MediaDeviceInfo[]
  audioContext: AudioContext
  audioEffects: AudioEffect[]
  videoEffects: VideoEffect[]
  addAudioEffect: (effect: AudioEffect) => void
  removeAudioEffect: (name: string) => void
  addVideoEffect: (effect: VideoEffect) => void
  removeVideoEffect: (name: string) => void
  setDevices: () => void
  getMediaStream: (mode?: "replace" | "concat") => Promise<void>
  stopMediaStream: () => void
  handleDeviceChange: () => void
  switchAudio: () => void
  switchVideo: () => Promise<void>
  setAudioDevice: (device: MediaDeviceInfo) => void
  setVideoDevice: (device: MediaDeviceInfo) => void
  init: () => void
}

export const mediaStreamStore = create<MediaStreamState>()(
  subscribeWithSelector((set, get) => ({
    // Стейт для медиапотока
    stream: new MediaStream(),
    audio: false,
    video: false,

    // Состояние для выбора устройств
    selectedAudioDevice: null,
    selectedVideoDevice: null,

    // Состояния для эффектов
    audioEffects: [],
    videoEffects: [],

    // Стримы для видео и аудио устройств
    audioDevices: [],
    videoDevices: [],

    // Один общий AudioContext
    audioContext: new AudioContext(),

    // Функции для получения и управления устройствами
    setDevices: async () => {
      const audioDevices = await navigator.mediaDevices.enumerateDevices()
      const videoDevices = audioDevices.filter(
        (device) => device.kind === "videoinput",
      )
      const audioInputDevices = audioDevices.filter(
        (device) => device.kind === "audioinput",
      )

      set({
        audioDevices: audioInputDevices,
        videoDevices: videoDevices,
      })
    },

    stopMediaStream: () => {
      get()
        .stream?.getTracks()
        .forEach((track) => {
          track.stop()
          get().stream?.removeTrack(track)
        })
      set({ stream: new MediaStream(), video: false })
    },

    // Функция для получения стрима
    getMediaStream: async (mode = "concat") => {
      console.log("getMediaStream", mode)
      const { selectedAudioDevice, selectedVideoDevice, audio, video } = get()

      const constraints = {
        audio: selectedAudioDevice
          ? { deviceId: selectedAudioDevice.deviceId }
          : true,
        video: video
          ? selectedVideoDevice
            ? { deviceId: selectedVideoDevice.deviceId }
            : true
          : false,
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia(constraints)
        if (mode === "replace") {
          get()
            .stream?.getTracks()
            .forEach((track) => {
              track.stop()
              get().stream?.removeTrack(track)
            })
          set({ stream: stream })
          console.log("streamusus", stream)
        } else {
          stream?.getAudioTracks().forEach((track) => (track.enabled = audio))
          stream?.getTracks().forEach((track) => get().stream?.addTrack(track))
        }
      } catch (error) {
        console.error("Error getting stream:", error)
      }
    },

    switchAudio: () => {
      get()
        .stream?.getAudioTracks()
        .forEach((track) => (track.enabled = !get().audio))
      set((state) => ({ audio: !state.audio }))
    },
    switchVideo: async () => {
      if (!get().stream) return
      if (get().video) {
        try {
          get()
            .stream?.getVideoTracks()
            .forEach((track) => {
              track.stop()
              get().stream?.removeTrack(track)
            })
          set({ video: false })
        } catch (error) {
          console.error("Error stopping video track", error)
        }
      } else {
        try {
          const mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
          })
          mediaStream.getVideoTracks().forEach((track) => {
            get().stream?.addTrack(track)
          })
          set({ video: true })
        } catch (error) {
          console.error("Error starting video track", error)
        }
      }
    },

    // Функция для изменения устройства для аудио
    setAudioDevice: async (device: MediaDeviceInfo) => {
      set({ selectedAudioDevice: device })
      const { getMediaStream, stream } = get()
      if (stream.getTracks().length > 0) {
        getMediaStream("replace")
      }
    },

    // Функция для изменения устройства для видео
    setVideoDevice: async (device: MediaDeviceInfo) => {
      set({ selectedVideoDevice: device })
      const { getMediaStream, stream } = get()
      if (stream.getTracks().length > 0) {
        getMediaStream("replace")
      }
    },

    // Функция для добавления эффекта аудио
    addAudioEffect: (effect: Omit<AudioEffect, "node">) => {
      const { stream, audioContext } = get()
      if (!stream || !audioContext) return

      // Применяем эффект ко всем аудиотрекам в стриме
      const source = audioContext.createMediaStreamSource(stream)
      const effectNode = effect.effect(audioContext, source)

      // Подключаем эффект к выходу
      source.connect(effectNode).connect(audioContext.destination)

      // Сохраняем эффект для возможного удаления
      set((state) => ({
        audioEffects: [...state.audioEffects, { ...effect, node: effectNode }],
      }))
    },

    // Функция для добавления эффекта видео
    addVideoEffect: (effect: Omit<VideoEffect, "node">) => {
      const { stream } = get()
      const videoStrem = new MediaStream(stream.getVideoTracks())
      const videoElement = document.createElement("video")
      videoElement.srcObject = videoStrem

      const effectCanvas = document.createElement("canvas")
      const ctx = effectCanvas.getContext("2d")
      videoElement.play()

      videoElement.addEventListener("play", () => {
        setInterval(() => {
          ctx?.drawImage(videoElement, 0, 0)
          effect.effect(ctx) // Применение эффекта к canvas
        }, 1000 / 30) // 30 fps
      })

      set((state) => ({
        videoEffects: [
          ...state.videoEffects,
          { ...effect, node: effectCanvas },
        ],
      }))
    },

    // Функция для удаления эффекта
    removeAudioEffect: (name: string) => {
      const { audioEffects } = get()
      const updatedEffects = audioEffects.filter((e) => e.name !== name)
      if (updatedEffects.length > 0) {
        updatedEffects[0].node?.disconnect()
      }

      set({ audioEffects: updatedEffects })
    },

    removeVideoEffect: (name: string) => {
      const { videoEffects } = get()
      const updatedEffects = videoEffects.filter((e) => e.name !== name)
      updatedEffects[0].node?.remove()

      set({ videoEffects: updatedEffects })
    },

    // Обработчик изменения устройств (plug/unplug)
    handleDeviceChange: () => {
      navigator.mediaDevices.addEventListener("devicechange", () => {
        get().setDevices()
      })
    },

    // Инициализация устройств и установка слушателя на подключение/отключение
    init: () => {
      get().setDevices()
      get().handleDeviceChange()
    },
  })),
)

export default mediaStreamStore
