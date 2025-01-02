
export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
    GUEST = 'GUEST'
}

export type UserId = Brand<string, 'UserId'>

export type UserData = {
    id: UserId | null;
    nickname: string | null;
    email: string | null;
    avatar: string | null;
    role: UserRole | null;
}

export type UserDataActions = {
    setUserData: (userData: UserData) => void;
    clearUserData: () => void;
    updateUserData: (userData: Partial<UserData>) => void;
}

export type UserDataStore = UserData & UserDataActions;