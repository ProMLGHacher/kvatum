import { AnimatePresence, motion } from "framer-motion"
import cls from "./OverlayingPopup.module.scss"
import { createPortal } from "react-dom"
export const OverlayingPopup = ({
  children,
  onClose,
  isOpened,
}: {
  children: React.ReactNode
  onClose: () => void
  isOpened: boolean
}) => {
  return createPortal(
    <AnimatePresence>
      {isOpened && (
        <div className={cls.container} role="dialog">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className={cls.overlay}
            role="button"
            tabIndex={0}
            onClick={onClose}
          />
          {children}
        </div>
      )}
    </AnimatePresence>,
    document.body,
  )
}
