import cls from "./ConferenceView.module.scss"
import { classNames } from "@/shared/lib/classNames/classNames"
import { Chat } from "@/widgets/Chat"
import { PanInfo, motion } from "framer-motion"
import { useState, useDeferredValue } from "react"
import { ConferencePreview } from "../ConferencePreview/ConferencePreview"
import { Channel } from "@/entities/channels"
import { hubsContentWindowsState } from "@/entities/hubsContentWindowsState"
import { conferenceStore } from "@/entities/conference"

export type ConferenceViewProps = {
  channel: Channel
}

export const ConferenceView = ({ channel }: ConferenceViewProps) => {
  const { chatIsOpen, conferenceIsOpen } = hubsContentWindowsState()
  const { roomId } = conferenceStore()

  const [chatWidth, setChatWidth] = useState(450) // Начальная ширина чата
  const width = useDeferredValue(chatWidth)

  const handleDrag = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo,
  ) => {
    const newWidth = chatWidth - info.delta.x
    setChatWidth(newWidth)
  }

  return (
    <div className={classNames(cls.serverInfoContent, [cls.resizable])}>
      {conferenceIsOpen && (
        <div className={cls.conference}>
          {!roomId && (
            <div className={cls.conferenceEmpty}>
              Войдите в конференцию чтобы увидеть плитки
            </div>
          )}
          {channel && <ConferencePreview channel={channel} />}
        </div>
      )}
      {chatIsOpen && conferenceIsOpen && (
        <motion.div
          className={cls.resizer}
          drag="x" // перетаскивание по оси X
          onDrag={handleDrag} // Обработчик изменения ширины
          dragConstraints={{ left: 0, right: 0 }}
          dragTransition={{
            bounceStiffness: 1000,
            bounceDamping: 100,
            power: 1000,
          }}
        />
      )}
      {chatIsOpen && (
        <div
          className={cls.chat}
          style={{
            width: chatIsOpen && conferenceIsOpen ? `${width}px` : "100%",
          }}
        >
          <Chat channel={channel} />
        </div>
      )}
    </div>
  )
}
