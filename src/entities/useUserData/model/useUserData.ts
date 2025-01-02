import { create } from "zustand";
import { UserDataStore, UserRole } from "./types";

export const useUserData = create<UserDataStore>((set) => ({
    avatar: null,
    nickname: null,
    email: null,
    id: null,
    role: null,
    setUserData: (userData) => set(userData),
    clearUserData: () => set({ avatar: null, nickname: null, email: null, id: null, role: UserRole.GUEST }),
    updateUserData: (userData) => set(userData),
})) 