import cls from "./ChatsList.module.scss"
import { NavLink } from "react-router"
import { classNames } from "@/shared/lib/classNames/classNames"

const chats = [
  {
    id: 1,
    name: "Chat 1",
    image: "/chat1.png",
  },
]

export const ChatsList = () => {
  return (
    <>
      {chats.map((chat) => (
        <NavLink
          to={`/main/chats/${chat.id}`}
          title={chat.name}
          key={chat.id}
          className={({ isActive }) =>
            classNames(cls.chat, { [cls.active]: isActive })
          }
        >
          <img src={chat.image} alt={chat.name} />
        </NavLink>
      ))}
    </>
  )
}
