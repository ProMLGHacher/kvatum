import { mediaStreamStore } from "@/entities/mediaStream"
import cls from "./ConferencePreview.module.scss"
import { AnimatePresence } from "framer-motion"
import { useState } from "react"
import { contextMenuStore } from "@/entities/contextMenu"
import { Channel } from "@/entities/channels"
import {
  conferenceStore,
  ConferenceViewItem,
  PeerConnectionId,
} from "@/entities/conference"
import { disconnectFromConferenceAction } from "../../model/conferenceActionsts"

export type ConferencePreviewProps = {
  channel: Channel
}

export const ConferencePreview = ({ channel }: ConferencePreviewProps) => {
  console.log(channel)
  const { stream } = mediaStreamStore()

  const { peers } = conferenceStore()

  const { openContextMenu } = contextMenuStore()
  const [selectedPeer, setSelectedPeer] = useState<
    PeerConnectionId | "me" | undefined
  >()

  const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    openContextMenu(
      [
        {
          id: "leave",
          text: "Leave",
          danger: true,
          onClick: disconnectFromConferenceAction,
        },
      ],
      { x: e.clientX, y: e.clientY },
    )
  }

  if (!peers) return null

  return (
    <>
      <AnimatePresence>
        {selectedPeer && (
          <ConferenceViewItem
            key={selectedPeer}
            onClick={() => {
              setSelectedPeer(undefined)
            }}
            stream={
              selectedPeer === "me"
                ? // TODO надо чтото решить с clone
                  stream.clone()
                : peers[selectedPeer].videoTrack
                  ? new MediaStream([peers[selectedPeer].videoTrack])
                  : null
            }
            className={cls.selected}
            overlayChildren={
              selectedPeer === "me" ? (
                stream?.getVideoTracks().length < 1 && (
                  <div className={cls.noVideoOverlay}>Включите видео</div>
                )
              ) : peers[selectedPeer].videoTrack ? null : (
                <div className={cls.noVideoOverlay}>Нет видео</div>
              )
            }
          />
        )}
      </AnimatePresence>
      <div className={cls.wrapper}>
        <ConferenceViewItem
          // TODO надо чтото решить с clone
          stream={stream.clone()}
          className={cls.me}
          onClick={() => {
            if (selectedPeer === "me") {
              setSelectedPeer(undefined)
            } else {
              setSelectedPeer("me")
            }
          }}
          onContextMenu={handleContextMenu}
          overlayChildren={
            stream?.getVideoTracks().length < 1 && (
              <div className={cls.noVideoOverlay}>Включите видео</div>
            )
          }
        />
        {Object.values(peers).map((peer) => (
          <ConferenceViewItem
            key={peer.id}
            stream={peer.videoTrack ? new MediaStream([peer.videoTrack]) : null}
            onClick={() => {
              if (selectedPeer === peer.id) {
                setSelectedPeer(undefined)
              } else {
                setSelectedPeer(peer.id)
              }
            }}
            onContextMenu={handleContextMenu}
            overlayChildren={
              peer.videoTrack ? null : (
                <div className={cls.noVideoOverlay}>Нет видео</div>
              )
            }
          />
        ))}
      </div>
    </>
  )
}
