import { UserRoleDto } from "../api/types"
import { UserRole } from "../model/types"

export const toUserRole = (userRoleDto: UserRoleDto): UserRole => {
  switch (userRoleDto) {
    case UserRoleDto.ADMIN:
      return UserRole.ADMIN
    case UserRoleDto.USER:
      return UserRole.USER
    default:
      return UserRole.GUEST
  }
}
