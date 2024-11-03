import cls from './HubsList.module.scss'
import { NavLink } from 'react-router-dom'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useHubs } from '@/entities/useHub'
import { CreateHubButton } from '../CreateHubButton/CreateHubButton'
import { useContextMenu } from '@/entities/useContextMenu'
import { createHubInvite } from '../../model/createHubInvite/createHubInvite'

export const HubsList = () => {

    const { hubsList } = useHubs()

    const { openContextMenu } = useContextMenu()

    return (
        <>
            {
                hubsList?.map((hub) => (
                    <NavLink
                        to={`/main/hubs/${hub.id}`}
                        title={hub.name}
                        key={hub.id}
                        onContextMenu={(e) => {
                            e.preventDefault()
                            openContextMenu([{
                                text: 'Создать инвайт',
                                icon: '🔗',
                                id: 'createInvite',
                                onClick: async () => {
                                    const inviteLink = await createHubInvite(hub.id)
                                    navigator.clipboard.writeText(inviteLink)
                                }
                            }], { x: e.clientX, y: e.clientY })
                        }}
                        style={{ backgroundColor: hub.hexColor }}
                        className={({ isActive }) => classNames(cls.hub, { [cls.active]: isActive })}
                    >
                        {
                            hub.images && <picture>
                                <source srcSet={hub.images.Small} type="image/webp" />
                                <img src={hub.images.Small} alt={hub.name} />
                            </picture>
                        }
                        <span className={cls.hubNameLetter}>{hub.name.slice(0, 1)}</span>
                    </NavLink>
                ))
            }
            <CreateHubButton />
        </>
    )
}