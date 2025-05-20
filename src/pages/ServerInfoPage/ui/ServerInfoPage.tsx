import { useParams } from "react-router"
import cls from "./ServerInfoPage.module.scss"
import { hubsStore } from "@/entities/hubs"
import { workSpaceStore } from "@/entities/workSpcae"
import { channelsStore } from "@/entities/channels/model/channelsStore"
import { ChannelView } from "@/widgets/ChannelView/ui/ChannelView"
import { HubParamsIds } from "@/features/hubs"
import { ConferenceWindowStateChangeWidget } from "@/entities/hubsContentWindowsState/ui/ConferenceWindowStateChangeWidget"

export default function ServerInfoPage() {
  const { channelId, workspaceId, hubId } = useParams<HubParamsIds>()
  const { hubs } = hubsStore()
  const { workSpaces } = workSpaceStore()
  const { channels } = channelsStore()

  if (!hubId || !workspaceId || !channelId)
    return <div>Этот канал не найден.</div>

  const channel = channels?.[workspaceId]?.[channelId]
  const currentHub = hubs?.[hubId]
  const currentWorkSpace = workSpaces?.[hubId]?.[workspaceId]

  return (
    <div className={cls.serverInfo}>
      <div className={cls.serverInfoHeader}>
        <h2>
          {currentHub?.name} {" > "} {currentWorkSpace?.name} {" > "}{" "}
          {channel?.name}
        </h2>
        {channel?.type === "Conference" && (
          <ConferenceWindowStateChangeWidget />
        )}
      </div>
      {channel && <ChannelView channel={channel} />}
    </div>
  )
}
