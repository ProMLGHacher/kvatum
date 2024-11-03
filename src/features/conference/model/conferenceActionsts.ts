import { useConference } from "@/entities/useConference"
import { ConferenceUser } from "@/entities/useConference/model/types"
import { useMediaStream } from "@/entities/useMediaStream"
import { useSignallingChannel } from "@/entities/useSignallingChannel"
import { useUserData } from "@/entities/useUserData"

const configuration: RTCConfiguration = { 'iceServers': [{ 'urls': 'stun:global.stun.twilio.com:3478' }], iceTransportPolicy: 'all' }

export const connectToConferenceAction = async (id: string) => {

    await useMediaStream.getState().getMediaStream()
    useConference.getState().setRoomId(id)

    useSignallingChannel.getState().sendMessage({
        "eventType": "JoinToRoom",
        "eventBody": {
            "roomId": id,
            "muted": !useMediaStream.getState().hasAudio,
            "camera": useMediaStream.getState().hasVideo
        }
    })


    useMediaStream.subscribe(
        state => state.stream,
        stream => {
            if (stream) {
                changeStreamPeerConnection(stream)
            }
        }
    )

    useMediaStream.subscribe(
        state => state.hasAudio,
        (hasAudio, prevHasAudio) => {
            if (hasAudio !== prevHasAudio) {
                useSignallingChannel.getState().sendMessage({
                    eventType: "microState",
                    eventBody: {
                        state: hasAudio
                    }
                })
            }
        }
    )

    useMediaStream.subscribe(
        state => state.hasVideo,
        (hasVideo, prevHasVideo) => {
            if (hasVideo !== prevHasVideo) {
                useSignallingChannel.getState().sendMessage({
                    eventType: "cameraState",
                    eventBody: {
                        state: hasVideo
                    }
                })
            }
        }
    )

}

export const configureConferenceSignallingChannel = () => {
    useSignallingChannel.getState().onMessage(message => {
        switch (message.data.eventType) {
            case 'UserList':    
                handleUserListMessage(message.data.users as ConferenceUser[])
                break
            case 'IceCandidate':
                handleIceCandidateMessage(message.data.iceCandidate, message.data.from)
                break
            case 'Offer':
                handleOfferMessage(message.data.offer, message.data.user)
                break
            case 'Answer':
                handleAnswerMessage(message.data.answer, message.data.from)
                break
            case 'UpdateOffer':
                handleUpdateOfferMessage(message.data.offer, message.data.from)
                break
            case 'UpdateAnswer':
                handleUpdateAnswerMessage(message.data.answer, message.data.from)
                break
            case 'MicroState':
                handleMicroStateMessage(message.data.state, message.data.from)
                break
            case 'CameraState':
                handleCameraStateMessage(message.data.state, message.data.from)
                break
        }
    })
}

const handleMicroStateMessage = (state: boolean, from: string) => {
    useConference.getState().setUserMuted(state, from)
}

const handleCameraStateMessage = (state: boolean, from: string) => {
    useConference.getState().setUserCamera(state, from)
}

const changeStreamPeerConnection = async (stream: MediaStream) => {
    Object.values(useConference.getState().peers!).forEach(peer => {
        peer.pc.getSenders().forEach(sender => {
            sender.track?.stop()
            peer.pc.removeTrack(sender)
        });

        stream.getTracks().forEach(track => {
            peer.pc.addTrack(track, stream)
        });
        sendUpdateOffer(peer.pc, peer.id)
    })
}

const sendUpdateOffer = async (pc: RTCPeerConnection, id: string) => {
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    useSignallingChannel.getState().sendMessage({
        "eventType": "UpdateOffer",
        "eventBody": {
            "offer": offer,
            "from": useUserData.getState().id,
            "to": id
        }
    });
}

const handleUserListMessage = (users: ConferenceUser[]) => {
    users.forEach(user => {
        makeCall(user)
    })
}

const makeCall = async (user: ConferenceUser) => {
    const pc = createPeerConnection(user)
    useConference.getState().addPeerConnection({
        id: user.id,
        pc,
        stream: null,
        volume: 100,
        user: user,
        state: 'pending'
    })

    configurePeerConnectionTracks(pc)

    // useSignallingChannel.getState().onMessage(handleAnswerMessage(pc))

    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)
    useSignallingChannel.getState().sendMessage({
        "eventType": "Offer",
        "eventBody": {
            "offer": offer,
            "from": useUserData.getState().id,
            "to": user.id
        }
    })
}



const createPeerConnection = (user: ConferenceUser) => {
    const peerConnection = new RTCPeerConnection(configuration)

    peerConnection.addEventListener('icecandidate', onIceCandidate(user))
    peerConnection.addEventListener("track", onTrack(user))
    peerConnection.addEventListener('connectionstatechange', handleConnectionStateChange(peerConnection, user))
    // useSignallingChannel.getState().onMessage(handleIceCandidateMessage(peerConnection))

    return peerConnection
}

const configurePeerConnectionTracks = (pc: RTCPeerConnection) => {
    useMediaStream.getState().stream?.getTracks().forEach(track => {
        pc.addTrack(track)
    })
}

const onIceCandidate = (user: ConferenceUser) => (event: RTCPeerConnectionIceEvent) => {
    const candidate = event.candidate
    if (candidate) {
        useSignallingChannel.getState().sendMessage({
            "eventType": "IceCandidate",
            "eventBody": {
                "iceCandidate": candidate,
                "from": useUserData.getState().id,
                "to": user.id
            }
        })
    }
}

// TODO: add remote stream to the state
const onTrack = (user: ConferenceUser) => (event: RTCTrackEvent) => {
    useConference.getState().setPeerConnectionStream(user.id, event.streams[0])
}

const handleConnectionStateChange = (pc: RTCPeerConnection, user: ConferenceUser) => () => {
    if (pc.connectionState === 'connected') {
        useConference.getState().setPeerConnectionState(user.id, 'connected')
        // useSignallingChannel.getState().onMessage(handleUpdateOfferMessage(pc))
        // useSignallingChannel.getState().onMessage(handleUpdateAnswerMessage(pc))
        // useSignallingChannel.getState().onMessage(handleRemoveTrackMessage(pc))
    }
}

const handleIceCandidateMessage = (iceCandidate: RTCIceCandidate, from: string) => {
    try {
        useConference.getState().peers![from].pc.addIceCandidate(iceCandidate)
    } catch (e) {
        console.error('Error adding received ice candidate', e)
    }
}

const handleUpdateOfferMessage = async (offer: RTCSessionDescriptionInit, from: string) => {
    if (offer) {
        await useConference.getState().peers![from].pc.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await useConference.getState().peers![from].pc.createAnswer()
        await useConference.getState().peers![from].pc.setLocalDescription(answer)
        useSignallingChannel.getState().sendMessage({
            "eventType": "UpdateAnswer",
            "eventBody": {
                "answer": answer,
                "from": useUserData.getState().id,
                "to": from
            }
        })
    }
}

const handleUpdateAnswerMessage = async (answer: any, from: string) => {
    if (answer) {
        await useConference.getState().peers![from].pc.setRemoteDescription(new RTCSessionDescription(answer))
    }
}


const handleAnswerMessage = async (answer: any, from: string) => {
    if (answer) {
        await useConference.getState().peers![from].pc.setRemoteDescription(new RTCSessionDescription(answer))
    }
}


const handleOfferMessage = async (offer: RTCSessionDescriptionInit, user: ConferenceUser) => {
    const peerConnection = createPeerConnection(user)
    configurePeerConnectionTracks(peerConnection)

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    useSignallingChannel.getState().sendMessage({
        "eventType": "Answer",
        "eventBody": {
            "answer": answer,
            "from": useUserData.getState().id,
            "to": user.id
        }
    })
}


// const listenNewConnections = async (stream: MediaStream) => {
//     useSignallingChannel.getState().onMessage(async (event) => {
//         if (event.data.offer) {
//             const peerConnection = createPeerConnection()
//             configurePeerConnectionTracks(peerConnection, stream)

//             await peerConnection.setRemoteDescription(new RTCSessionDescription(event.data.offer))
//             const answer = await peerConnection.createAnswer()
//             await peerConnection.setLocalDescription(answer)
//             useSignallingChannel.getState().sendMessage({ 'answer': answer })
//         }
//     })
// }