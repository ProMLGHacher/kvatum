import { conferenceStore } from "@/entities/conference"
import { ConferenceUser } from "@/entities/conference/model/types"
import { mediaStreamStore } from "@/entities/mediaStream"
import { signallingChannelStore } from "@/entities/signallingChannel"
import { userDataStore } from "@/entities/userData"
import { shallow } from "zustand/shallow"

const configuration: RTCConfiguration = {
  iceServers: [{ urls: "stun:global.stun.twilio.com:3478" }],
  iceTransportPolicy: "all",
}

const abortController = new AbortController()

export const connectToConferenceAction = async (id: string) => {
  try {
    await mediaStreamStore.getState().getMediaStream()
  } catch (error) {
    console.error(error)
    return
  }
  conferenceStore.getState().setRoomId(id)

  signallingChannelStore.getState().sendMessage({
    eventType: "JoinToRoom",
    eventBody: {
      roomId: id,
      muted: !mediaStreamStore.getState().audio,
      camera: mediaStreamStore.getState().video,
    },
  })

  const unsubscribeVideo = mediaStreamStore.subscribe(
    (state) => state.video,
    changeVideoState,
    { equalityFn: shallow },
  )

  const unsubscribeAudio = mediaStreamStore.subscribe(
    (state) => state.audio,
    changeMicroState,
    { equalityFn: shallow },
  )

  const unsubscribeStream = mediaStreamStore.subscribe(
    (state) => state.stream,
    changeStreamState,
    {
      equalityFn: (prev, next) => {
        console.log("equalityFn", prev, next)
        console.log(prev?.id === next?.id)
        return prev?.id === next?.id
      },
    },
  )

  abortController.signal.addEventListener("abort", () => {
    unsubscribeVideo()
    unsubscribeAudio()
    unsubscribeStream()
  })
}

const changeStreamState = async (stream: MediaStream) => {
  console.log("changeStreamState")
  if (!conferenceStore.getState().peers) return
  const localMediaStream = stream
  if (!localMediaStream) return
  const tracks = localMediaStream.getTracks()

  for (const peer of Object.values(conferenceStore.getState().peers!)) {
    for (const sender of peer.pc.getSenders()) {
      if (sender.track?.kind === "video") {
        peer.pc.removeTrack(sender)
      }
    }
    for (const track of tracks) {
      peer.pc.addTrack(track, localMediaStream)
    }
    await sendUpdateOffer(peer.pc, peer.id)
  }
}

const changeVideoState = async (video: boolean) => {
  if (!conferenceStore.getState().peers) return
  await new Promise((resolve) => setTimeout(resolve, 1000))
  const localMediaStream = mediaStreamStore.getState().stream
  if (!localMediaStream) return
  signallingChannelStore.getState().sendMessage({
    eventType: "ChangeVideoState",
    eventBody: video,
  })
  const videoTracks = localMediaStream.getVideoTracks()
  console.log(videoTracks)

  for (const peer of Object.values(conferenceStore.getState().peers!)) {
    if (video) {
      for (const track of videoTracks) {
        peer.pc.addTrack(track, localMediaStream)
      }
      await sendUpdateOffer(peer.pc, peer.id)
    } else {
      for (const sender of peer.pc.getSenders()) {
        if (sender.track?.kind === "video") {
          peer.pc.removeTrack(sender)
        }
      }
      await sendUpdateOffer(peer.pc, peer.id)
    }
  }
}

const changeMicroState = (audio: boolean) => {
  signallingChannelStore.getState().sendMessage({
    eventType: "ChangeMicroState",
    eventBody: audio,
  })
}

export const disconnectFromConferenceAction = () => {
  abortController.abort()
  mediaStreamStore.getState().stopMediaStream()
  conferenceStore.getState().disconnectFromConference()
  signallingChannelStore.getState().sendMessage({
    eventType: "Disconnect",
  })
}

export const configureConferenceSignallingChannel = () => {
  console.log("configureConferenceSignallingChannel")

  signallingChannelStore.getState().onMessage((message) => {
    switch (message.eventType) {
      case "UserList":
        console.log("UserList", message.users)
        handleUserListMessage(message.users as ConferenceUser[])
        break
      case "IceCandidate":
        handleIceCandidateMessage(message.iceCandidate, message.from.id)
        break
      case "Offer":
        handleOfferMessage(message.offer, message.from as ConferenceUser)
        break
      case "Answer":
        handleAnswerMessage(message.answer, message.from.id)
        break
      case "UpdateOffer":
        handleUpdateOfferMessage(message.offer, message.from.id)
        break
      case "UpdateAnswer":
        handleUpdateAnswerMessage(message.answer, message.from.id)
        break
      case "ChangeMicroState":
        handleMicroStateMessage(message.isMicroMuted, message.from)
        break
      case "ChangeVideoState":
        handleCameraStateMessage(message.hasVideo, message.from)
        break
      case "Disconnect":
        handleDisconnectMessage(message.from)
        break
    }
  })
}

const handleDisconnectMessage = (from: string) => {
  conferenceStore.getState().removePeerConnection(from)
}

const handleMicroStateMessage = (state: boolean, from: string) => {
  conferenceStore.getState().setUserMuted(state, from)
}

const handleCameraStateMessage = (state: boolean, from: string) => {
  conferenceStore.getState().setUserCamera(state, from)
  if (!state) {
    conferenceStore
      .getState()
      .peers![from].pc.getReceivers()
      .forEach((receiver) => {
        if (receiver.track?.kind === "video") {
          receiver.track.stop()
        }
      })
  }
}

const sendUpdateOffer = async (pc: RTCPeerConnection, id: string) => {
  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  signallingChannelStore.getState().sendMessage({
    eventType: "UpdateOffer",
    eventBody: {
      offer: offer,
      from: userDataStore.getState().id,
      to: id,
    },
  })
}

const handleUserListMessage = (users: ConferenceUser[]) => {
  users.forEach((user) => {
    makeCall(user)
  })
}

const makeCall = async (user: ConferenceUser) => {
  console.log("makeCall", user)
  const pc = createPeerConnection(user)
  conferenceStore.getState().addPeerConnection({
    id: user.id,
    pc,
    audioTrack: null,
    videoTrack: null,
    volume: 100,
    user: user,
    isMicroMuted: user.isMicroMuted,
    hasVideo: user.hasVideo,
    state: "pending",
  })

  configurePeerConnectionTracks(pc)

  // signallingChannelStore.getState().onMessage(handleAnswerMessage(pc))

  const offer = await pc.createOffer()
  await pc.setLocalDescription(offer)
  signallingChannelStore.getState().sendMessage({
    eventType: "Offer",
    eventBody: {
      offer: offer,
      from: userDataStore.getState().id,
      to: user.id,
    },
  })
}

const createPeerConnection = (user: ConferenceUser) => {
  const peerConnection = new RTCPeerConnection(configuration)

  peerConnection.addEventListener("icecandidate", onIceCandidate(user))
  peerConnection.addEventListener("track", onTrack(user.id))
  peerConnection.addEventListener(
    "connectionstatechange",
    handleConnectionStateChange(peerConnection, user),
  )
  // signallingChannelStore.getState().onMessage(handleIceCandidateMessage(peerConnection))

  return peerConnection
}

const configurePeerConnectionTracks = (pc: RTCPeerConnection) => {
  mediaStreamStore
    .getState()
    .stream?.getTracks()
    .forEach((track) => {
      pc.addTrack(track)
    })
  // mediaStreamStore.getState().stream!.onaddtrack = (event) => {
  //     pc.addTrack(event.track)
  // }
  // mediaStreamStore.getState().stream!.onremovetrack = (event) => {
  //     pc.getSenders().forEach(sender => {
  //         if (sender.track?.kind === event.track.kind) {
  //             pc.removeTrack(sender)
  //         }
  //     })
  // }
}

const onIceCandidate =
  (user: ConferenceUser) => (event: RTCPeerConnectionIceEvent) => {
    const candidate = event.candidate
    if (candidate) {
      signallingChannelStore.getState().sendMessage({
        eventType: "IceCandidate",
        eventBody: {
          iceCandidate: candidate,
          from: userDataStore.getState().id,
          to: user.id,
        },
      })
    }
  }

const onTrack = (userId: string) => (event: RTCTrackEvent) => {
  console.log("NEW TRACK", event.track.kind)
  console.log("NEW TRACK", event.track.enabled)
  console.log("NEW TRACK", event.track)

  if (event.track.kind === "audio") {
    conferenceStore.getState().setPeerConnectionAudioTrack(userId, event.track)
  } else if (event.track.kind === "video") {
    conferenceStore.getState().setPeerConnectionVideoTrack(userId, event.track)
  }
}

const handleConnectionStateChange =
  (pc: RTCPeerConnection, user: ConferenceUser) => () => {
    if (pc.connectionState === "connected") {
      conferenceStore.getState().setPeerConnectionState(user.id, "connected")
    }
    if (pc.connectionState === "disconnected") {
      conferenceStore.getState().removePeerConnection(user.id)
    }
  }

const handleIceCandidateMessage = (
  iceCandidate: RTCIceCandidate,
  from: string,
) => {
  try {
    conferenceStore.getState().peers![from].pc.addIceCandidate(iceCandidate)
  } catch (e) {
    console.error("Error adding received ice candidate", e)
  }
}

const handleUpdateOfferMessage = async (
  offer: RTCSessionDescriptionInit,
  from: string,
) => {
  if (offer) {
    await conferenceStore
      .getState()
      .peers![from].pc.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await conferenceStore
      .getState()
      .peers![from].pc.createAnswer()
    await conferenceStore.getState().peers![from].pc.setLocalDescription(answer)
    signallingChannelStore.getState().sendMessage({
      eventType: "UpdateAnswer",
      eventBody: {
        answer: answer,
        From: userDataStore.getState().id,
        To: from,
      },
    })
  }
}

const handleUpdateAnswerMessage = async (answer: any, from: string) => {
  if (answer) {
    await conferenceStore
      .getState()
      .peers![from].pc.setRemoteDescription(new RTCSessionDescription(answer))
  }
}

const handleAnswerMessage = async (answer: any, from: string) => {
  console.log(answer)
  console.log(from)

  try {
    await conferenceStore
      .getState()
      .peers![from].pc.setRemoteDescription(new RTCSessionDescription(answer))
  } catch (error) {
    console.error("Error adding received answer", error)
  }
}

const handleOfferMessage = async (
  offer: RTCSessionDescriptionInit,
  user: ConferenceUser,
) => {
  const peerConnection = createPeerConnection(user)
  configurePeerConnectionTracks(peerConnection)
  conferenceStore.getState().addPeerConnection({
    id: user.id,
    pc: peerConnection,
    audioTrack: null,
    videoTrack: null,
    volume: 100,
    user: user,
    isMicroMuted: user.isMicroMuted,
    hasVideo: user.hasVideo,
    state: "pending",
  })

  await peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
  const answer = await peerConnection.createAnswer()
  await peerConnection.setLocalDescription(answer)
  signallingChannelStore.getState().sendMessage({
    eventType: "Answer",
    eventBody: {
      Answer: answer,
      From: userDataStore.getState().id,
      To: user.id,
    },
  })
}

// const listenNewConnections = async (stream: MediaStream) => {
//     signallingChannelStore.getState().onMessage(async (event) => {
//         if (event.data.offer) {
//             const peerConnection = createPeerConnection()
//             configurePeerConnectionTracks(peerConnection, stream)

//             await peerConnection.setRemoteDescription(new RTCSessionDescription(event.data.offer))
//             const answer = await peerConnection.createAnswer()
//             await peerConnection.setLocalDescription(answer)
//             signallingChannelStore.getState().sendMessage({ 'answer': answer })
//         }
//     })
// }
