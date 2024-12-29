import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { MainHeader } from '@/widgets/MainHeader'
export const MainPage = () => {
  const navigate = useNavigate()


  useEffect(() => {
    if (location.pathname === '/main') {
      navigate('/main/hubs')
    }
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.shiftKey && ev.key === 'Tab') {
        navigate(location.pathname.includes('/main/hubs') ? '/main/chats' : '/main/hubs');
        ev.preventDefault();
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  }, []);

  return (
   <>
      <MainHeader />
      <Outlet />
    </>
  )
}