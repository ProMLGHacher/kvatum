import { Channel } from "@/features/channels"
import { ConferenceView } from "@/features/conference"
import { Chat } from "@/widgets/Chat"

export type ChannelViewProps = {
  channel: Channel
}

export const ChannelView = ({ channel }: ChannelViewProps) => {
  switch (channel.type) {
    case "Conference":
      return <ConferenceView channel={channel} />
    case "Chat":
      return <Chat channel={channel} />
    case "Channel":
      return <div>Channel</div>
  }
}
