// import cls from './ProfilePage.module.scss'
import Button from '@/shared/ui/Button/Button'
import { logOutAction } from '@/features/authentication/logOutAction/logOutAction'
import { PopUp } from '@/shared/ui/PopUp/PopUp/PopUp'
import { useState } from 'react'

export const ProfilePage = () => {

  const [isProfilePopupOpened, setIsProfilePopupOpened] = useState(false)

  const onCloseProfilePopup = () => {
    setIsProfilePopupOpened(false)
  }

  return (
    <div>
      <Button onClick={() => {
        logOutAction()
      }}>
        Logout
      </Button>
      <button onClick={() => { setIsProfilePopupOpened(true) }}>
        Open profile
      </button>
      <PopUp isOpened={isProfilePopupOpened} onClose={onCloseProfilePopup}>
        <div>
          <h1>Profile</h1>
        </div>
      </PopUp>
    </div>
  )
}
