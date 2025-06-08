export const enum ToastType {
  SUCCESS = "success",
  ERROR = "error",
  INFO = "info",
  WARNING = "warning",
}
export const enum ToastDuration {
  SHORT = "short",
  MEDIUM = "medium",
  LONG = "long",
}

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
