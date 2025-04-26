import cls from "./HubsList.module.scss"
import { NavLink } from "react-router-dom"
import { classNames } from "@/shared/lib/classNames/classNames"
import { hubsStore } from "@/entities/hubs"
import { CreateHubButton } from "../CreateHubButton/CreateHubButton"
import { contextMenuStore } from "@/entities/contextMenu"
import { createHubInvite } from "../../model/createHubInvite/createHubInvite"

export const HubsList = () => {
  const { hubs } = hubsStore()

  const { openContextMenu } = contextMenuStore()

  return (
    <>
      {Object.values(hubs ?? {}).map((hub) => (
        <NavLink
          to={`/main/hubs/${hub.id}`}
          title={hub.name}
          key={hub.id}
          onContextMenu={(e) => {
            e.preventDefault()
            openContextMenu(
              [
                {
                  text: "Создать инвайт",
                  icon: "🔗",
                  id: "createInvite",
                  onClick: async () => {
                    const inviteLink = await createHubInvite(hub.id)
                    navigator.clipboard.writeText(inviteLink)
                  },
                },
              ],
              { x: e.clientX, y: e.clientY },
            )
          }}
          style={{ backgroundColor: hub.hexColor }}
          className={({ isActive }) =>
            classNames(cls.hub, { [cls.active]: isActive })
          }
        >
          {hub.images && (
            <picture>
              <source srcSet={hub.images.Small} type="image/webp" />
              <img src={hub.images.Small} alt={hub.name} />
            </picture>
          )}
          <span className={cls.hubNameLetter}>{hub.name.slice(0, 1)}</span>
        </NavLink>
      ))}
      <CreateHubButton />
    </>
  )
}
