import cls from "./ConferenceViewItem.module.scss"
import { classNames } from "@/shared/lib/classNames/classNames"
import { HTMLMotionProps, motion } from "framer-motion"
import { VideoView } from "@/shared/ui/VideoView"

export type ConferenceViewItemProps = {
  stream?: MediaStream | null
  overlayChildren?: React.ReactNode
} & HTMLMotionProps<"div">

export const ConferenceViewItem = ({
  className,
  stream,
  overlayChildren,
  ...props
}: ConferenceViewItemProps) => {
  return (
    <motion.div
      {...props}
      className={classNames(cls.conferenceViewItem, [className])}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      layout
    >
      <VideoView muted stream={stream} />
      {overlayChildren && <div className={cls.overlay}>{overlayChildren}</div>}
    </motion.div>
  )
}
