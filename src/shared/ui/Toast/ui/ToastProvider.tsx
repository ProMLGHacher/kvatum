import React, { useContext, useEffect, useState } from "react"
import {
  ToastDuration,
  ToastType,
  Toast as ToastDataType,
} from "../model/types"
import { getDuration, initToast } from "../model/toast"
import { Toast } from "./Toast"
import { ToastContext } from "../model/ToastContext"
import { AnimatePresence } from "framer-motion"

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastDataType[]>([])

  const addToast = (
    message: string,
    type: ToastType = "info",
    duration: ToastDuration = "medium",
  ) => {
    const id = Math.random().toString(36).substring(2, 9)
    setToasts((prev) => [...prev, { id, message, type, duration }])

    if (duration) {
      setTimeout(() => removeToast(id), getDuration(duration))
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

const ToastContainer = () => {
  const { toasts, removeToast, addToast } = useContext(ToastContext)!

  useEffect(() => {
    initToast(addToast)
  }, [addToast])

  return (
    <div
      style={{
        position: "fixed",
        bottom: 10,
        right: 10,
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 10,
      }}
    >
      <AnimatePresence mode="sync">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} removeToast={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  )
}
