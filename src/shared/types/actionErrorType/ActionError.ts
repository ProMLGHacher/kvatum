const ACTION_ERROR_SYMBOL = Symbol("ActionError")

/**
 * Уровень ошибки
 * @description low - ошибки пользователя, подразумевается показывать warning toast (400 ошибки например)
 * @description medium - ошибки приложения, подразумевается показывать error toast (500 ошибки например)
 * @description high - ошибки критичные, блокирующие работу приложения (неопределенные ошибки)
 * (например все сетевые ошибки проверили, а проблема в том что забыли поставить ? для поля и читаем из undefined)
 * (или же поменялась дто на сервере и мы пытаемся дальше читать поле которого уже нет)
 */
export type ErrorLevel = "low" | "medium" | "high"

export type ActionErrorConfig = {
  errorLevel: ErrorLevel
  originalError?: unknown
}

export class ActionError extends Error {
  originalError?: unknown
  errorLevel: ErrorLevel

  readonly [ACTION_ERROR_SYMBOL] = true

  constructor(
    message: string = "Ошибка при выполнении действия",
    config: ActionErrorConfig = {
      errorLevel: "low",
      originalError: undefined,
    },
  ) {
    super(message)
    this.name = "ActionError"
    this.errorLevel = config.errorLevel
    this.originalError = config.originalError
  }
}

export const isActionError = (error: unknown): error is ActionError =>
  error instanceof ActionError && error[ACTION_ERROR_SYMBOL]
