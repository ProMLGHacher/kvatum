import { classNames } from "@/shared/lib/classNames/classNames"
import { NavLink, Outlet, useParams } from "react-router"
import cls from "./ChannelPage.module.scss"
import { channelsStore } from "@/entities/channels/model/channelsStore"
import { connectToConferenceAction } from "@/features/conference/model/conferenceActionsts"
import { HubParamsIds } from "@/features/hubs"

export default () => {
  const { hubId, workspaceId } = useParams<HubParamsIds>()

  const { channels } = channelsStore()

  if (!workspaceId) return <div>Что-то пошло не так.</div>

  if (!channels?.[workspaceId]) {
    return <div>В этом рабочем пространстве нет каналов.</div>
  }

  const channelsInWorkspace = Object.values(channels?.[workspaceId])

  return (
    <main className={cls.serverMain}>
      <nav className={cls.serverNav}>
        <h3 className={cls.serverNavTitle}>Каналы</h3>
        <div className={cls.channels}>
          {channelsInWorkspace
            .filter((channel) => channel.type === "Channel")
            .map((channel) => (
              <NavLink
                key={channel.id}
                title={channel.name}
                className={classNames(cls.channel, [cls.textChannel])}
                to={`/main/hubs/${hubId}/${workspaceId}/${channel.id}`}
                end
              >
                {channel.name}
              </NavLink>
            ))}
        </div>
        <h3 className={cls.serverNavTitle}>Чаты</h3>
        <div className={cls.channels}>
          {channelsInWorkspace
            ?.filter((channel) => channel.type === "Chat")
            .map((channel) => (
              <NavLink
                key={channel.id}
                title={channel.name}
                className={classNames(cls.channel, [cls.textChannel])}
                to={`/main/hubs/${hubId}/${workspaceId}/${channel.id}`}
                end
              >
                {channel.name}
              </NavLink>
            ))}
        </div>
        <h3 className={cls.serverNavTitle}>Конференции</h3>
        <div className={cls.channels}>
          {channelsInWorkspace
            ?.filter((channel) => channel.type === "Conference")
            .map((channel) => (
              <NavLink
                key={channel.id}
                title={channel.name}
                className={classNames(cls.channel, [cls.voiceChannel])}
                to={`/main/hubs/${hubId}/${workspaceId}/${channel.id}`}
                end
              >
                {channel.name}
                <button
                  style={{
                    marginLeft: "10px",
                    backgroundColor: "red",
                    color: "white",
                  }}
                  onClick={() => {
                    connectToConferenceAction(channel.id)
                  }}
                >
                  Join
                </button>
              </NavLink>
            ))}
        </div>
      </nav>
      <Outlet />
    </main>
  )
}
