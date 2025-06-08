import {
  ToastType as ToastTypeEnum,
  ToastDuration as ToastDurationEnum,
} from "@/shared/ui/Toast/model/types"

declare const _brand: unique symbol

declare global {
  /**
   * Custom utility types
   */

  // реализация toast лежит в src/shared/ui/Toast/
  export type ToastType = ToastTypeEnum
  export type ToastDuration = ToastDurationEnum

  export function toast(
    message: string,
    type?: ToastType,
    duration?: ToastDuration,
  )

  export type Nullable<T> = T | null

  export type Keys<T extends Record<string, unknown>> = keyof T

  export type Values<T extends Record<string, unknown>> = T[Keys<T>]

  export type Indexed<K = string, T = unknown> = { [key: K]: T }

  export type Brand<K, T> = K & { [_brand]: T }

  /**
   * Type aliases
   */
  export type Phone = string

  export type Email = string

  export type Password = string

  export type Id = string

  export type DateIso = string

  export type Timestamp = number

  export type Penny = number

  export type Url = string

  export type Color = string

  export type AccessToken = Brand<string, "AccessToken">
  export type RefreshToken = Brand<string, "RefreshToken">

  export function taggedError<T>(name: string, error: T) {
    console.error(name, error)
    return error
  }
}

export {}
