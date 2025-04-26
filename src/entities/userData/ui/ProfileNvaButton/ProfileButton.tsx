import { NavLink } from "react-router-dom"
import cls from "./ProfileButton.module.scss"
import ProfileIcon from "@/shared/svg/AvatarUser.svg?react"
import { classNames } from "@/shared/lib/classNames/classNames"

export const ProfileNvaButton = () => {
  return (
    <NavLink
      className={({ isActive }) =>
        classNames(cls.profileButton, {
          [cls.active]: isActive,
        })
      }
      to={"/main/profile"}
    >
      <ProfileIcon className={cls.profileIcon} />
    </NavLink>
  )
}
