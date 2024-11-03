import { useParams } from 'react-router-dom';
import cls from './ServerInfoPage.module.scss';
import { useHubs } from '@/entities/useHub';
import { useWorkSpace } from '@/entities/useWorkSpcae';
import { useChannels } from '@/entities/useChannels/model/useChannels';
import { ChannelView } from '@/widgets/ChannelView/ui/ChannelView';

export const ServerInfoPage = () => {

    const { channelId } = useParams()
    const { currentHub } = useHubs()
    const { currentWorkSpace } = useWorkSpace()
    const { channels } = useChannels()
    const channel = channels?.find(channel => channel.id === channelId)

    return (
        <div className={cls.serverInfo}>
            <div className={cls.serverInfoHeader}>
                <h2>{currentHub?.name} | {currentWorkSpace?.name}</h2>
            </div>
            {channel && <ChannelView channel={channel} />}
        </div>
    )
}
