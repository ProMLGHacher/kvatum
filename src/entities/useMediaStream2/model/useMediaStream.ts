import { create } from "zustand"
import { subscribeWithSelector } from "zustand/middleware"

// name must be unique
type AudioEffect = {
  effect: (
    audioContext: AudioContext,
    source: MediaStreamAudioSourceNode,
  ) => AudioNode
  node: AudioNode
  name: string
}

// name must be unique
type VideoEffect = {
  effect: (ctx: CanvasRenderingContext2D | null) => void
  node: HTMLCanvasElement
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
  setDevices: () => void
  getStream: () => void
  handleDeviceChange: () => void
  init: () => void
}

const mediaStreamStore = create<MediaStreamState>()(
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

    // Функция для получения стрима
    getStream: async () => {
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
        stream?.getAudioTracks().forEach((track) => (track.enabled = audio))
        stream?.getTracks().forEach((track) => get().stream?.addTrack(track))
      } catch (error) {
        console.error("Error getting stream:", error)
      }
    },

    // Функция для изменения устройства для аудио
    setAudioDevice: async (deviceId: MediaDeviceInfo) => {
      set({ selectedAudioDevice: deviceId })
      get().getStream()
    },

    // Функция для изменения устройства для видео
    setVideoDevice: async (deviceId: MediaDeviceInfo) => {
      set({ selectedVideoDevice: deviceId })
      get().getStream()
    },

    // Функция для добавления эффекта аудио
    addAudioEffect: (effect: Omit<AudioEffect, "node">) => {
      const { stream, audioContext } = get()
      if (!stream || !audioContext) return

      // Создаем источник из аудио потока
      const source = audioContext.createMediaStreamSource(stream)

      // Применяем эффект
      const effectNode = effect.effect(audioContext, source) // Применение эффекта

      // Подключаем эффект к выходу
      effectNode.connect(audioContext.destination)

      // Сохраняем эффект для возможного удаления
      set((state) => ({
        audioEffects: [...state.audioEffects, { ...effect, node: effectNode }],
      }))
    },

    // Функция для добавления эффекта видео
    addVideoEffect: (effect: Omit<VideoEffect, "node">) => {
      const { stream } = get()
      const videoElement = document.createElement("video")
      videoElement.srcObject = stream

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
    removeAudioEffect: (effect: AudioEffect) => {
      const { audioEffects } = get()
      const updatedEffects = audioEffects.filter((e) => e !== effect)
      effect.node.disconnect()

      set({ audioEffects: updatedEffects })
    },

    removeVideoEffect: (effect: VideoEffect) => {
      const { videoEffects } = get()
      const updatedEffects = videoEffects.filter((e) => e !== effect)
      effect.node.remove()

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
