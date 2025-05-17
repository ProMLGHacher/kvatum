import { mediaStreamStore } from "@/entities/mediaStream"
import cls from "./MainHeader.module.scss"
import { ProfileNvaButton } from "@/entities/userData"
import { ChatsList } from "@/features/chats/ui/ChatsList"
import { HubsList } from "@/features/hubs"
import { useLocation } from "react-router"
import {
  AudioEffect,
  VideoEffect,
} from "@/entities/mediaStream/model/mediaStreamStore"

const audioGainEffect: AudioEffect = {
  effect: (audioContext: AudioContext) => {
    const gainNode = new GainNode(audioContext)
    gainNode.gain.value = 0.2
    return gainNode
  },
  name: "audioGainEffect",
}

const videoEffect: VideoEffect = {
  effect: (ctx: CanvasRenderingContext2D | null) => {
    if (!ctx) return
    ctx.fillStyle = "red"
    ctx.fillRect(0, 0, ctx.canvas.width / 4, ctx.canvas.height / 4)
  },
  name: "videoEffect",
}

export const MainHeader = () => {
  const { pathname } = useLocation()
  const isChatsPage = pathname.includes("/main/chats")

  const {
    audioDevices,
    videoDevices,
    setAudioDevice,
    setVideoDevice,
    selectedAudioDevice,
    selectedVideoDevice,
    audioEffects,
    addAudioEffect,
    removeAudioEffect,
    addVideoEffect,
    removeVideoEffect,
    videoEffects,
  } = mediaStreamStore()

  return (
    <>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            padding: "10px",
            border: "1px solid #888",
            borderRadius: "5px",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => {
            addVideoEffect(videoEffect)
          }}
        >
          add video effect
        </button>
        <button
          style={{
            padding: "10px",
            border: "1px solid #888",
            borderRadius: "5px",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => {
            removeVideoEffect(videoEffect.name)
          }}
        >
          remove video effect
        </button>
        <div style={{ display: "flex", gap: "10px" }}>
          {videoEffects.map((effect) => (
            <div
              style={{
                padding: "10px",
                border: "1px solid #888",
                borderRadius: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              key={effect.name}
            >
              {effect.name}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <button
          style={{
            padding: "10px",
            border: "1px solid #888",
            borderRadius: "5px",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => {
            addAudioEffect(audioGainEffect)
          }}
        >
          add audio gain effect
        </button>
        <button
          style={{
            padding: "10px",
            border: "1px solid #888",
            borderRadius: "5px",
            backgroundColor: "transparent",
            cursor: "pointer",
          }}
          onClick={() => {
            removeAudioEffect(audioGainEffect.name)
          }}
        >
          remove audio gain effect
        </button>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {audioEffects.map((effect) => (
            <div
              style={{
                padding: "10px",
                border: "1px solid #888",
                borderRadius: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              key={effect.name}
            >
              {effect.name}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {audioDevices.map((device) => (
            <button
              onClick={() => setAudioDevice(device)}
              style={{
                padding: "10px",
                border:
                  device.deviceId === selectedAudioDevice?.deviceId
                    ? "1px solid #FFF"
                    : "1px solid #888",
                borderRadius: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              key={device.deviceId}
            >
              {device.label}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {videoDevices.map((device) => (
            <button
              onClick={() => setVideoDevice(device)}
              style={{
                padding: "10px",
                border:
                  device.deviceId === selectedVideoDevice?.deviceId
                    ? "1px solid #FFF"
                    : "1px solid #888",
                borderRadius: "5px",
                backgroundColor: "transparent",
                cursor: "pointer",
              }}
              key={device.deviceId}
            >
              {device.label}
            </button>
          ))}
        </div>
      </div>
      <nav className={cls.mainHeader}>
        <ProfileNvaButton />
        {isChatsPage ? <ChatsList /> : <HubsList />}
      </nav>
    </>
  )
}
