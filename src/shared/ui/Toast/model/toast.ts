import { ToastContextType, ToastDuration, ToastType } from "./types"

let toastFunction: ToastContextType["addToast"]

export const initToast = (toast: ToastContextType["addToast"]) => {
  toastFunction = toast
}

export const getDuration = (duration: ToastDuration) => {
  if (duration === ToastDuration.SHORT) return 1500
  if (duration === ToastDuration.MEDIUM) return 3000
  if (duration === ToastDuration.LONG) return 5000
  return 3000
}

export function toast(
  message: string,
  type: ToastType = ToastType.INFO,
  duration: ToastDuration = ToastDuration.MEDIUM,
) {
  if (toastFunction) {
    toastFunction(message, type, duration)
  } else {
    console.warn("Toast not initialized yet")
  }
}
