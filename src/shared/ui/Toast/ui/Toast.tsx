import { classNames } from "@/shared/lib/classNames/classNames"
import { Toast as ToastType } from "../model/types"
import cls from "./Toast.module.scss"
import { motion } from "framer-motion"

export type ToastProps = {
  toast: ToastType
  removeToast: (id: string) => void
}

export const Toast = ({ toast, removeToast }: ToastProps) => {
  return (
    <motion.div
      key={toast.id}
      layout
      initial={{ opacity: 0, y: 100, x: 0 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, y: 0, x: 100 }}
      transition={{ duration: 0.5 }}
      className={classNames(cls.toast, [cls[toast.type]])}
      onClick={() => removeToast(toast.id)}
    >
      {toast.message}
    </motion.div>
  )
}
