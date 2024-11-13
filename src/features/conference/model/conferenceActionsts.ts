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
}

export const switchConferenceMicroAction = () => {
    const { hasAudio, muteAudio, unmuteAudio } = useMediaStream.getState()
    if (hasAudio) {
        muteAudio()
        useSignallingChannel.getState().sendMessage({
            eventType: "ChangeMicroState",
            eventBody: false
        })
    } else {
        unmuteAudio()
        useSignallingChannel.getState().sendMessage({
            eventType: "ChangeMicroState",
            eventBody: true
        })
    }
}

export const switchConferenceCameraAction = () => {
    const { hasVideo, startVideo, stopVideo } = useMediaStream.getState()
    if (hasVideo) {
        stopVideo()
        useSignallingChannel.getState().sendMessage({
            eventType: "ChangeVideoState",
            eventBody: false
        })
    } else {
        startVideo()
        useSignallingChannel.getState().sendMessage({
            eventType: "ChangeVideoState",
            eventBody: true
        })
    }
}

export const disconnectFromConferenceAction = () => {
    useConference.getState().disconnectFromConference()
    useMediaStream.getState().stopMediaStream()
    useSignallingChannel.getState().sendMessage({
        eventType: "Disconnect"
    })
}

export const configureConferenceSignallingChannel = () => {
    console.log('configureConferenceSignallingChannel');
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
        stream: new MediaStream(),
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
    console.log('ON TRACK', user.id);

    console.log("АБОБУС", event);


    useConference.getState().addPeerConnectionStreamTrack(user.id, event.track)
    console.log('ХУЙХУЙХУХЙУХЙХУЙХУХЙУХЙХУХЙХУХЙУ');
    console.log(useConference.getState().peers);

}

const handleConnectionStateChange = (pc: RTCPeerConnection, user: ConferenceUser) => () => {

    if (pc.connectionState === 'connected') {
        console.log("ХУЙХУЙХУХЙУХЙХУЙХУХЙУХЙХУХЙХУХЙУ", user.id);
        useConference.getState().setPeerConnectionState(user.id, 'connected')
        // useSignallingChannel.getState().onMessage(handleUpdateOfferMessage(pc))
        // useSignallingChannel.getState().onMessage(handleUpdateAnswerMessage(pc))
        // useSignallingChannel.getState().onMessage(handleRemoveTrackMessage(pc))
    }
}

const handleIceCandidateMessage = (iceCandidate: RTCIceCandidate, from: string) => {
    try {
        console.log(useConference.getState().peers);

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
        stream: new MediaStream(),
        volume: 100,
        user: user,
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