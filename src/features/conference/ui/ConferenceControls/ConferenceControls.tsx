import cls from './ConferenceControls.module.scss'
import Button from '@/shared/ui/Button/Button'
import { useMediaStream } from '@/entities/useMediaStream'
import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { BiCamera, BiCameraOff, BiExit, BiMicrophone, BiMicrophoneOff } from 'react-icons/bi'
import { disconnectFromConferenceAction, switchConferenceCameraAction, switchConferenceMicroAction } from '../../model/conferenceActionsts'


interface ConferenceControlsProps {
    opened: boolean
    onClose: () => void
}

export const ConferenceControls = ({ opened, onClose }: ConferenceControlsProps) => {

    const { stream, hasAudio, hasVideo } = useMediaStream()

    const videoRef = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.srcObject = stream
        }
    }, [stream])

    return (
        <motion.div
            onMouseLeave={onClose}
            initial={{ right: '-400px' }}
            animate={{ right: opened ? 0 : '-400px' }}
            className={cls.conferenceControls}
        >
            <Button onClick={switchConferenceMicroAction}>
                {hasAudio ? <BiMicrophone /> : <BiMicrophoneOff />}
            </Button>
            <Button onClick={switchConferenceCameraAction}>
                {hasVideo ? <BiCamera /> : <BiCameraOff />}
            </Button>
            <Button onClick={disconnectFromConferenceAction}>
                <BiExit />
            </Button>
            {hasVideo && <video className={cls.video} ref={videoRef} autoPlay muted></video>}
        </motion.div>
    )
}
