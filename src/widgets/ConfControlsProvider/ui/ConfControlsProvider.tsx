import cls from './ConfControlsProvider.module.scss'
import { createPortal } from 'react-dom'
import { ConferenceControls } from '@/features/conference/ui/ConferenceControls/ConferenceControls'
import { useState } from 'react'

interface ConfControlsProviderProps {
    children: React.ReactNode
}

export const ConfControlsProvider = ({ children }: ConfControlsProviderProps) => {
    const [opened, setOpened] = useState(false)

    return <>
        {createPortal(<ConferenceControls opened={opened} onClose={() => setOpened(false)} />, document.body)}
        {createPortal(<div className={cls.confControlsSwitcher} onMouseEnter={() => setOpened(true)} >
            <div className={cls.confControlsSwitcherLine}></div>
        </div>, document.body)}
        {children}
    </>
}
