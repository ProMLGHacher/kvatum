import { classNames } from '@/shared/lib/classNames/classNames';
import { NavLink, Outlet, useParams } from 'react-router-dom';
import cls from './ChannelPage.module.scss';
import { useChannels } from '@/entities/useChannels/model/useChannels';
import { useEffect } from 'react';
import { getChannelsAction } from '@/features/channels';
import { WorkSpaceId } from '@/entities/useWorkSpcae';
import { connectToConferenceAction } from '@/features/conference/model/conferenceActionsts';

export const ChannelPage = () => {

    const { hubId, workspaceId } = useParams()

    const { channels } = useChannels()

    useEffect(() => {
        if (workspaceId) {
            getChannelsAction(workspaceId as WorkSpaceId)
        }
    }, [workspaceId])

    return (
        <main className={cls.serverMain}>
            <nav className={cls.serverNav}>
                <h3 className={cls.serverNavTitle}>Каналы</h3>
                <div className={cls.channels}>
                    {
                        channels?.filter((channel) => channel.type === 'Channel').map((channel) => (
                            <NavLink
                                key={channel.id}
                                title={channel.name}
                                className={classNames(cls.channel, [cls.textChannel])}
                                to={`/main/hubs/${hubId}/${workspaceId}/${channel.id}`}
                                end
                            >
                                {channel.name}
                            </NavLink>
                        ))
                    }
                </div>
                <h3 className={cls.serverNavTitle}>Чаты</h3>
                <div className={cls.channels}>
                    {
                        channels?.filter((channel) => channel.type === 'Chat').map((channel) => (
                            <NavLink
                                key={channel.id}
                                title={channel.name}
                                className={classNames(cls.channel, [cls.textChannel])}
                                to={`/main/hubs/${hubId}/${workspaceId}/${channel.id}`}
                                end
                            >
                                {channel.name}
                            </NavLink>
                        ))
                    }
                </div>
                <h3 className={cls.serverNavTitle}>Конференции</h3>
                <div className={cls.channels}>
                    {
                        channels?.filter((channel) => channel.type === 'Conference').map((channel) => (
                            <NavLink
                                key={channel.id}
                                title={channel.name}
                                className={
                                    classNames(cls.channel, [cls.voiceChannel])
                                }
                                to={`/main/hubs/${hubId}/${workspaceId}/${channel.id}`}
                                end
                            >
                                {channel.name}
                                <button
                                    style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}
                                    onClick={() => {
                                        connectToConferenceAction(channel.id)
                                    }}>Join</button>
                            </NavLink>
                        ))
                    }
                </div>
            </nav>
            <Outlet />
        </main>
    )
}
