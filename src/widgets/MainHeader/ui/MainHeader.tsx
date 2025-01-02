import cls from './MainHeader.module.scss'
import { ProfileNvaButton } from '@/entities/useUserData'
import { ChatsList } from '@/features/chats/ui/ChatsList'
import { HubsList } from '@/features/hubs'
import { useLocation } from 'react-router-dom'

export const MainHeader = () => {

  const { pathname } = useLocation()
  const isChatsPage = pathname.includes('/main/chats')

  return (
    <nav className={cls.mainHeader}>
      <ProfileNvaButton />
      {isChatsPage ? <ChatsList /> : <HubsList />}
    </nav>
  )
}
