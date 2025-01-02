import { useConference } from "@/entities/useConference"
import { ConferenceUser } from "@/entities/useConference/model/types"
import { useMediaStream } from "@/entities/useMediaStream"
import { useSignallingChannel } from "@/entities/useSignallingChannel"
import { useUserData } from "@/entities/useUserData"
import { shallow } from "zustand/shallow"

const configuration: RTCConfiguration = { 'iceServers': [{ 'urls': 'stun:global.stun.twilio.com:3478' }], iceTransportPolicy: 'all' }

export const connectToConferenceAction = async (id: string) => {

    await useMediaStream.getState().getMediaStream()
    useConference.getState().setRoomId(id)

    useSignallingChannel.getState().sendMessage({
        "eventType": "JoinToRoom",
        "eventBody": {
            "roomId": id,
            "muted": !useMediaStream.getState().audio,
            "camera": useMediaStream.getState().video
        }
    })

    useMediaStream.subscribe(
        state => state.video,
        video => {
            changeVideoState(video)
        },
        { equalityFn: shallow }
    )

    useMediaStream.subscribe(
        state => state.audio,
        audio => {
            changeMicroState(audio)
        },
        { equalityFn: shallow }
    )
}

const changeVideoState = async (video: boolean) => {
    if (!useConference.getState().peers) return
    await new Promise(resolve => setTimeout(resolve, 1000))
    const localMediaStream = useMediaStream.getState().stream
    if (!localMediaStream) return
    useSignallingChannel.getState().sendMessage({
        eventType: "ChangeVideoState",
        eventBody: video
    })
    const videoTracks = localMediaStream.getVideoTracks()
    console.log(videoTracks);
    
    for (const peer of Object.values(useConference.getState().peers!)) {
        if (video) {
            for (const track of videoTracks) {
                peer.pc.addTrack(track, localMediaStream)
            }
            await sendUpdateOffer(peer.pc, peer.id)
        } else {
            for (const sender of peer.pc.getSenders()) {
                if (sender.track?.kind === 'video') {
                    peer.pc.removeTrack(sender)
                }
            }
            await sendUpdateOffer(peer.pc, peer.id)
        }
    }
}

const changeMicroState = (audio: boolean) => {
    useSignallingChannel.getState().sendMessage({
        eventType: "ChangeMicroState",
        eventBody: audio
    })
}

export const disconnectFromConferenceAction = () => {
    useMediaStream.getState().stopMediaStream()
    useConference.getState().disconnectFromConference()
    useSignallingChannel.getState().sendMessage({
        eventType: "Disconnect"
    })
}

export const configureConferenceSignallingChannel = () => {
    useSignallingChannel.getState().onMessage(message => {
        switch (message.eventType) {
            case 'UserList':
                handleUserListMessage(message.users as ConferenceUser[])
                break
            case 'IceCandidate':
                handleIceCandidateMessage(message.iceCandidate, message.from.id)
                break
            case 'Offer':
                handleOfferMessage(message.offer, message.from as ConferenceUser)
                break
            case 'Answer':
                handleAnswerMessage(message.answer, message.from.id)
                break
            case 'UpdateOffer':
                handleUpdateOfferMessage(message.offer, message.from.id)
                break
            case 'UpdateAnswer':
                handleUpdateAnswerMessage(message.answer, message.from.id)
                break
            case 'ChangeMicroState':
                handleMicroStateMessage(message.isMicroMuted, message.from)
                break
            case 'ChangeVideoState':
                handleCameraStateMessage(message.hasVideo, message.from)
                break
            case 'Disconnect':
                handleDisconnectMessage(message.from)
                break
        }
    })
}

const handleDisconnectMessage = (from: string) => {
    useConference.getState().removePeerConnection(from)
}

const handleMicroStateMessage = (state: boolean, from: string) => {
    useConference.getState().setUserMuted(state, from)
}

const handleCameraStateMessage = (state: boolean, from: string) => {
    useConference.getState().setUserCamera(state, from)
    if (!state) {
        useConference.getState().peers![from].pc.getReceivers().forEach(receiver => {
            if (receiver.track?.kind === 'video') {
                receiver.track.stop()
            }
        });
    }
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
        audioTrack: null,
        videoTrack: null,
        volume: 100,
        user: user,
        isMicroMuted: user.isMicroMuted,
        hasVideo: user.hasVideo,
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
    peerConnection.addEventListener("track", onTrack(user.id))
    peerConnection.addEventListener('connectionstatechange', handleConnectionStateChange(peerConnection, user))
    // useSignallingChannel.getState().onMessage(handleIceCandidateMessage(peerConnection))

    return peerConnection
}

const configurePeerConnectionTracks = (pc: RTCPeerConnection) => {
    useMediaStream.getState().stream?.getTracks().forEach(track => {
        pc.addTrack(track)
    })
    // useMediaStream.getState().stream!.onaddtrack = (event) => {
    //     pc.addTrack(event.track)
    // }
    // useMediaStream.getState().stream!.onremovetrack = (event) => {
    //     pc.getSenders().forEach(sender => {
    //         if (sender.track?.kind === event.track.kind) {
    //             pc.removeTrack(sender)
    //         }
    //     })
    // }
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
const onTrack = (userId: string) => (event: RTCTrackEvent) => {

    console.log("NEW TRACK", event.track.kind);
    console.log("NEW TRACK", event.track.enabled);
    console.log("NEW TRACK", event.track);
    

    if (event.track.kind === 'audio') {
        useConference.getState().setPeerConnectionAudioTrack(userId, event.track)
    } else if (event.track.kind === 'video') {
        useConference.getState().setPeerConnectionVideoTrack(userId, event.track)
    }

}

const handleConnectionStateChange = (pc: RTCPeerConnection, user: ConferenceUser) => () => {

    if (pc.connectionState === 'connected') {
        useConference.getState().setPeerConnectionState(user.id, 'connected')
    }
    if (pc.connectionState === 'disconnected') {
        useConference.getState().removePeerConnection(user.id)
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
                "From": useUserData.getState().id,
                "To": from
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
    console.log(answer);
    console.log(from);

    try {
        await useConference.getState().peers![from].pc.setRemoteDescription(new RTCSessionDescription(answer))
    } catch (error) {
        console.error('Error adding received answer', error);
    }
}


const handleOfferMessage = async (offer: RTCSessionDescriptionInit, user: ConferenceUser) => {
    const peerConnection = createPeerConnection(user)
    configurePeerConnectionTracks(peerConnection)
    useConference.getState().addPeerConnection({
        id: user.id,
        pc: peerConnection,
        audioTrack: null,
        videoTrack: null,
        volume: 100,
        user: user,
        isMicroMuted: user.isMicroMuted,
        hasVideo: user.hasVideo,
        state: 'pending'
    })

    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)
    useSignallingChannel.getState().sendMessage({
        "eventType": "Answer",
        "eventBody": {
            "Answer": answer,
            "From": useUserData.getState().id,
            "To": user.id
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