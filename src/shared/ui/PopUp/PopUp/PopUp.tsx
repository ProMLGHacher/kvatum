import cls from "./PopUp.module.scss"
import { classNames } from "@/shared/lib/classNames/classNames"
import { OverlayingPopup } from "../OverlayingPopup/OverlayingPopup"
import { motion } from "framer-motion"

export const PopUp = ({
  children,
  onClose,
  isOpened,
  className,
}: {
  children: React.ReactNode
  onClose: () => void
  isOpened: boolean
  className?: string
}) => {
  return (
    <OverlayingPopup onClose={onClose} isOpened={isOpened}>
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        transition={{ duration: 0.3 }}
        className={classNames(cls.container, [className])}
      >
        {children}
      </motion.div>
    </OverlayingPopup>
  )
}
