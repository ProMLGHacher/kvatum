import { UserDataDto } from "../api/types";
import { UserData, UserId } from "../model/types";
import { toUserRole } from "./toUserRole";

export const toUserData = (userDataDto: UserDataDto): UserData => {
    return {
        id: userDataDto.id as UserId,
        nickname: userDataDto.nickname,
        email: userDataDto.identifier,
        avatar: userDataDto.urlIcon,
        role: toUserRole(userDataDto.role),
    }
}