import { ToastContextType, ToastDuration, ToastType } from "./types"

let toastFunction: ToastContextType["addToast"]

export const initToast = (toast: ToastContextType["addToast"]) => {
  toastFunction = toast
}

export const getDuration = (duration: ToastDuration) => {
  if (duration === "short") return 1000
  if (duration === "medium") return 3000
  if (duration === "long") return 5000
  return 3000
}

export function toast(
  message: string,
  type?: ToastType,
  duration?: ToastDuration,
) {
  if (toastFunction) {
    toastFunction(message, type, duration)
  } else {
    console.warn("Toast not initialized yet")
  }
}
