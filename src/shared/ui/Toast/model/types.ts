export type ToastType = "success" | "error" | "info" | "warning"
export type ToastDuration = "short" | "medium" | "long"

export type Toast = {
  id: string
  message: string
  type: ToastType
  duration?: ToastDuration
}

export type ToastContextType = {
  toasts: Toast[]
  addToast: (
    message: string,
    type?: ToastType,
    duration?: ToastDuration,
  ) => void
  removeToast: (id: string) => void
}
