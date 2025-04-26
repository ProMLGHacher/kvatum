export class ActionError extends Error {
  constructor(message: string = "Ошибка при выполнении действия") {
    super(message)
    this.name = "ActionError"
  }
}

export const isActionError = (error: any): error is ActionError => {
  return error instanceof ActionError
}
