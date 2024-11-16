import { useMediaStream } from '@/entities/useMediaStream'
import cls from './ConferencePreview.module.scss'
import { classNames } from '@/shared/lib/classNames/classNames'
import { AnimatePresence, motion } from 'framer-motion'
import { useRef, useEffect, useState } from 'react'
import { useContextMenu } from '@/entities/useContextMenu'
import { Channel } from '@/features/channels'
import { useConference } from '@/entities/useConference'
import { disconnectFromConferenceAction } from '../../model/conferenceActionsts'
import { useUserData } from '@/entities/useUserData'


export type ConferencePreviewProps = {
    channel: Channel
}

export const ConferencePreview = ({ channel }: ConferencePreviewProps) => {

    const { stream, video } = useMediaStream()

    const { peers, microState, videoState } = useConference()

    const { openContextMenu } = useContextMenu()
    const [selectedPeer, setSelectedPeer] = useState<string>()

    const handleContextMenu = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        openContextMenu([
            {
                id: 'leave',
                text: 'Leave',
                danger: true,
                onClick: disconnectFromConferenceAction
            },
        ], { x: e.clientX, y: e.clientY })
    }

    if (!peers) return null

    return (
        <>
            <AnimatePresence>
                {
                    selectedPeer && (
                        <motion.div
                            key={selectedPeer}
                            initial={{ opacity: 0.5, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0 }}
                            className={classNames(cls.conferenceViewItem, { [cls.selected]: true })}
                            onClick={() => {
                                setSelectedPeer(undefined)
                            }}
                            whileHover={{ scale: 1.002 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                        >
                            {
                                selectedPeer === 'me' ?
                                    (Boolean(stream) && <VideoView muted stream={stream} />)
                                    : <VideoView stream={new MediaStream([peers[selectedPeer].videoTrack!])} muted />
                            }
                        </motion.div>
                    )
                }
            </AnimatePresence>
            <div className={cls.wrapper}>
                <motion.div
                    className={classNames(cls.conferenceViewItem)}
                    onClick={() => {
                        if (selectedPeer === 'me') {
                            setSelectedPeer(undefined)
                        } else {
                            setSelectedPeer('me')
                        }
                    }}
                    onContextMenu={handleContextMenu}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    layout
                >
                    <span>me</span>
                    <span>{useUserData.getState().id}</span>
                    <span>{video.toString()}</span>
                    {video && <VideoView stream={stream} muted />}
                </motion.div>
                {
                    Object.values(peers).map((peer) => (
                        <motion.div
                            key={peer.id}
                            className={classNames(cls.conferenceViewItem)}
                            onClick={() => {
                                if (selectedPeer === peer.id) {
                                    setSelectedPeer(undefined)
                                } else {
                                    setSelectedPeer(peer.id)
                                }
                            }}
                            onContextMenu={handleContextMenu}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            layout
                        >
                            <span>{peer.id}</span>
                            <br />
                            <span>micro: {microState[peer.id].toString()}</span>
                            <br />
                            <span>video: {videoState[peer.id].toString()}</span>
                            <br />
                            <span>videoTrack: {peer.videoTrack ? 'video' : 'no video'}</span>
                            <br />
                            <span>audioTrack: {peer.audioTrack ? 'audio' : 'no audio'}</span>
                            {peer.videoTrack && <VideoView stream={new MediaStream([peer.videoTrack])} />}
                        </motion.div>
                    ))
                }
            </div>
        </>
    )
}

const VideoView = ({ stream, volume = 100, muted = false }: { stream: MediaStream | null, volume?: number, muted?: boolean }) => {

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
        }
    }, [stream])

    useEffect(() => {

        if (!videoRef.current) return
        if (!volume) return

        videoRef.current.volume = volume / 100

    }, [volume])

    if (!stream) return null

    return <video muted={muted} className={cls.videoView} autoPlay style={{ width: '100%', height: '100%', zIndex: 2 }} ref={videoRef} />
}
