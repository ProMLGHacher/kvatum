import cls from './Chat.module.scss';

import { Channel } from "@/features/channels"

export type ChatProps = {
    channel?: Channel;
}

export const Chat = (props: ChatProps) => {
    return (
        <div className={cls.chat}>
            {props.channel && <div>
                {props.channel.name}
            </div>}
            <div>
                Comming soon...
            </div>
        </div>
    )
}