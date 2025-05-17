export class ActionError extends Error {
  originalError?: unknown

  constructor(
    message: string = "Ошибка при выполнении действия",
    originalError?: unknown,
  ) {
    super(message)
    this.name = "ActionError"
    this.originalError = originalError
  }
}

export const isActionError = (error: unknown): error is ActionError => {
  return error instanceof ActionError
}
