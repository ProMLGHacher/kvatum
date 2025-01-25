import { Outlet, useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { MainHeader } from '@/widgets/MainHeader'
export const MainPage = () => {
  const navigate = useNavigate()
  const prevPath = useRef<string>()


  useEffect(() => {
    if (location.pathname === '/main') {
      navigate('/main/hubs')
    }
  }, [location.pathname])

  useEffect(() => {
    const handleKeyDown = (ev: KeyboardEvent) => {
      if (ev.shiftKey && ev.key === 'Tab') {
        console.log(prevPath.current);
        console.log(location.pathname);

        if (prevPath.current) {
          const navPath = prevPath.current
          prevPath.current = location.pathname
          navigate(navPath);
        } else {
          prevPath.current = location.pathname
          navigate(location.pathname.includes('/main/hubs') ? '/main/chats' : '/main/hubs');
        }
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