export type AudioEffect = (
  audioContext: AudioContext,
  audioNode: MediaStreamAudioSourceNode,
) => void
export type VideoEffect = (videoElement: HTMLVideoElement) => void

export type MediaStreamFields = {
  stream: MediaStream | null
  audio: boolean
  video: boolean
  audioEffects: AudioEffect[]
  videoEffects: VideoEffect[]
}

export type MediaStreamActions = {
  getMediaStream: () => Promise<void>
  switchAudio: () => void
  switchVideo: () => void
  stopMediaStream: () => void
  addAudioEffect: (effect: (audioContext: AudioContext) => void) => void
  removeAudioEffect: () => void
  addVideoEffect: (effect: (videoElement: HTMLVideoElement) => void) => void
  removeVideoEffect: () => void
}

export type MediaStreamState = MediaStreamFields & MediaStreamActions
