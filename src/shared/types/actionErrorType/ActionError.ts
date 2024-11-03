export class ActionError extends Error {
    constructor(message: string = "An error occurred during the action") {
        super(message);
        this.name = "ActionError";
    }
}

export const isActionError = (error: any): error is ActionError => {
    return error instanceof ActionError;
}