import cls from './ConferenceView.module.scss'
import { classNames } from "@/shared/lib/classNames/classNames";
import { Chat } from "@/widgets/Chat";
import { PanInfo, motion } from "framer-motion";
import { useState, useDeferredValue } from "react";
import { ConferencePreview } from '../ConferencePreview/ConferencePreview';
import { Channel } from '@/features/channels';


export type ConferenceViewProps = {
    channel: Channel
}

export const ConferenceView = ({ channel }: ConferenceViewProps) => {

    const [chatWidth, setChatWidth] = useState(450); // Начальная ширина чата
    const width = useDeferredValue(chatWidth)

    const handleDrag = (_: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const newWidth = chatWidth - info.delta.x
        setChatWidth(newWidth);
    };

    return (
        <div className={classNames(cls.serverInfoContent, [cls.resizable])}>
            <div className={cls.conference}>
                {channel && <ConferencePreview channel={channel} />}
            </div>
            <motion.div
                className={cls.resizer}
                drag="x" // перетаскивание по оси X
                onDrag={handleDrag} // Обработчик изменения ширины
                dragConstraints={{ left: 0, right: 0 }}
                dragTransition={{ bounceStiffness: 1000, bounceDamping: 100, power: 1000 }}
            />
            <div className={cls.chat} style={{ width: `${width}px` }}>
                <Chat channel={channel} />
            </div>
        </div>
    )
}
