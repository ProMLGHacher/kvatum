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
                        State: hasAudio
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
                        State: hasVideo
                    }
                })
            }
        }
    )

}

export const configureConferenceSignallingChannel = () => {
    console.log('configureConferenceSignallingChannel');
    useSignallingChannel.getState().onMessage(message => {
        switch (message.EventType) {
            case 'UsersList':
                handleUserListMessage(message.Users as ConferenceUser[])
                break
            case 'IceCandidate':
                handleIceCandidateMessage(JSON.parse(message.IceCandidate), message.From.Id)
                break
            case 'Offer':
                handleOfferMessage(JSON.parse(message.Offer), message.From as ConferenceUser)
                break
            case 'Answer':
                handleAnswerMessage(message.Answer, message.From.Id)
                break
            case 'UpdateOffer':
                handleUpdateOfferMessage(message.Offer, message.From.Id)
                break
            case 'UpdateAnswer':
                handleUpdateAnswerMessage(message.Answer, message.From.Id)
                break
            case 'MicroState':
                handleMicroStateMessage(message.State, message.From.Id)
                break
            case 'CameraState':
                handleCameraStateMessage(message.State, message.From.Id)
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
            "Offer": offer,
            "From": useUserData.getState().id,
            "To": id
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
        id: user.Id,
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
            "Offer": offer,
            "From": useUserData.getState().id,
            "To": user.Id
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
                "IceCandidate": candidate,
                "From": useUserData.getState().id,
                "To": user.Id
            }
        })
    }
}

// TODO: add remote stream to the state
const onTrack = (user: ConferenceUser) => (event: RTCTrackEvent) => {
    console.log('ON TRACK', user.Id);

    console.log("АБОБУС", event);
    
    
    useConference.getState().addPeerConnectionStreamTrack(user.Id, event.track)
    console.log('ХУЙХУЙХУХЙУХЙХУЙХУХЙУХЙХУХЙХУХЙУ');
    console.log(useConference.getState().peers);
    
}

const handleConnectionStateChange = (pc: RTCPeerConnection, user: ConferenceUser) => () => {

    if (pc.connectionState === 'connected') {
        console.log("ХУЙХУЙХУХЙУХЙХУЙХУХЙУХЙХУХЙХУХЙУ", user.Id);
        useConference.getState().setPeerConnectionState(user.Id, 'connected')
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
                "UpdateAnswer": answer,
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
        id: user.Id,
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
            "To": user.Id
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