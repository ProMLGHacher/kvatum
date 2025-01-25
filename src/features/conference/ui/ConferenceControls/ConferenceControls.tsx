import cls from './ConferenceControls.module.scss'
import Button from '@/shared/ui/Button/Button'
import { useMediaStream } from '@/entities/useMediaStream'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BiCamera, BiCameraOff, BiExit, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { disconnectFromConferenceAction } from '../../model/conferenceActionsts'
import { classNames } from '@/shared/lib/classNames/classNames'


interface ConferenceControlsProps {
    opened: boolean
    onClose: () => void
}

export const ConferenceControls = ({ opened, onClose }: ConferenceControlsProps) => {

    const { stream, audio, video, switchVideo, switchAudio } = useMediaStream()

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
            videoRef.current.play()
        }
    }, [video])

    return (
        <motion.div
            onMouseLeave={onClose}
            initial={{ right: '-400px' }}
            animate={{ right: opened ? 0 : '-400px' }}
            className={cls.conferenceControls}
        >
            {/* <Button onClick={getMediaStream}>
                <BiMicrophone />
            </Button> */}
            <Button onClick={switchAudio}>
                {audio ? <BiMicrophone /> : <BiMicrophoneOff />}
            </Button>
            <Button onClick={switchVideo}>
                {video ? <BiCamera /> : <BiCameraOff />}
            </Button>
            <Button onClick={disconnectFromConferenceAction}>
                <BiExit />
            </Button>
            <video className={classNames(cls.video, { [cls.videoHidden]: !video })} ref={videoRef} autoPlay muted></video>
        </motion.div>
    )
}
