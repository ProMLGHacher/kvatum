export enum UserRoleDto {
  ADMIN = "Admin",
  USER = "User",
}

export type UserDataDto = {
  id: string
  identifier: Email
  nickname: string
  role: UserRoleDto
  urlIcon: string
}
