import { useParams } from "react-router-dom"
import cls from "./ServerInfoPage.module.scss"
import { hubsStore } from "@/entities/hubs"
import { workSpaceStore } from "@/entities/workSpcae"
import { channelsStore } from "@/entities/channels/model/channelsStore"
import { ChannelView } from "@/widgets/ChannelView/ui/ChannelView"
import { hubsContentWindowsState } from "@/entities/hubsContentWindowsState"
import Button from "@/shared/ui/Button/Button"
import { BsLayoutTextWindow, BsLayoutTextWindowReverse } from "react-icons/bs"
import { HubParamsIds } from "@/features/hubs"

export default () => {
  const { channelId, workspaceId, hubId } = useParams<HubParamsIds>()
  const { hubs } = hubsStore()
  const { workSpaces } = workSpaceStore()
  const { channels } = channelsStore()
  const { chatIsOpen, conferenceIsOpen, setChatIsOpen, setConferenceIsOpen } =
    hubsContentWindowsState()

  if (!hubId || !workspaceId || !channelId)
    return <div>Этот канал не найден.</div>

  const channel = channels?.[workspaceId]?.[channelId]
  const currentHub = hubs?.[hubId]
  const currentWorkSpace = workSpaces?.[hubId]?.[workspaceId]

  return (
    <div className={cls.serverInfo}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
        className={cls.serverInfoHeader}
      >
        <h2>
          {currentHub?.name} | {currentWorkSpace?.name} | ;uhuoygoliu
        </h2>
        {channel?.type === "Conference" && (
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
            className={cls.serverInfoHeaderButtons}
          >
            <Button
              style={{ opacity: conferenceIsOpen ? 1 : 0.5 }}
              onClick={() => setConferenceIsOpen(!conferenceIsOpen)}
            >
              <BsLayoutTextWindowReverse />
            </Button>
            <Button
              style={{ opacity: chatIsOpen ? 1 : 0.5 }}
              onClick={() => setChatIsOpen(!chatIsOpen)}
            >
              <BsLayoutTextWindow />
            </Button>
          </div>
        )}
      </div>
      {channel && <ChannelView channel={channel} />}
    </div>
  )
}
