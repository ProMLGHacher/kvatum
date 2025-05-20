import { useEffect } from "react"

import { useRef } from "react"

import cls from "./VideoView.module.scss"

export type VideoViewProps = {
  stream?: MediaStream | null
  volume?: number
  muted?: boolean
}

export const VideoView = ({
  stream,
  volume = 100,
  muted = false,
}: VideoViewProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (!videoRef.current) return
    console.log("ХУЙstream", stream)

    if (!stream) {
      videoRef.current.srcObject = null
      videoRef.current.load()
      return
    }
    videoRef.current.srcObject = stream
    videoRef.current.play()
  }, [stream])

  useEffect(() => {
    if (!videoRef.current) return
    if (!volume) return

    videoRef.current.volume = volume / 100
  }, [volume])

  if (!stream)
    return (
      <div className={cls.videoView}>
        <div className={cls.videoViewEmpty}>
          <p>No video</p>
        </div>
      </div>
    )

  return (
    <video
      muted={muted}
      className={cls.videoView}
      autoPlay
      style={{ width: "100%", height: "100%", zIndex: 2 }}
      ref={videoRef}
    />
  )
}
