import { useParams } from 'react-router-dom';
import cls from './ServerInfoPage.module.scss';
import { useHubs } from '@/entities/useHub';
import { useWorkSpace } from '@/entities/useWorkSpcae';
import { useChannels } from '@/entities/useChannels/model/useChannels';
import { ChannelView } from '@/widgets/ChannelView/ui/ChannelView';
import { useServerContentWindowsState } from '@/entities/useServerContentWindowsState';
import Button from '@/shared/ui/Button/Button';
import { BsLayoutTextWindow, BsLayoutTextWindowReverse } from 'react-icons/bs';

export const ServerInfoPage = () => {
    
    const { channelId } = useParams()
    const { currentHub } = useHubs()
    const { currentWorkSpace } = useWorkSpace()
    const { channels } = useChannels()
    const { chatIsOpen, conferenceIsOpen, setChatIsOpen, setConferenceIsOpen } = useServerContentWindowsState()
    const channel = channels?.find(channel => channel.id === channelId)

    return (
        <div className={cls.serverInfo}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }} className={cls.serverInfoHeader}>
                <h2>{currentHub?.name} | {currentWorkSpace?.name}</h2>
                {
                    channel?.type === 'Conference' && <div style={{
                        display: 'flex',
                        gap: '10px',
                        alignItems: 'center'
                    }} className={cls.serverInfoHeaderButtons}>
                        <Button style={{ opacity: conferenceIsOpen ? 1 : 0.5 }} onClick={() => setConferenceIsOpen(!conferenceIsOpen)}><BsLayoutTextWindowReverse /></Button>
                        <Button style={{ opacity: chatIsOpen ? 1 : 0.5 }} onClick={() => setChatIsOpen(!chatIsOpen)}><BsLayoutTextWindow /></Button>
                    </div>
                }

            </div>
            {channel && <ChannelView channel={channel} />}
        </div>
    )
}
