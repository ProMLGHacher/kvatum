import cls from './ConfControlsProvider.module.scss'
import { createPortal } from 'react-dom'
import { ConferenceControls } from '@/features/conference/ui/ConferenceControls/ConferenceControls'
import { useState } from 'react'
import { useTokensData } from '@/entities/useTokensData'

interface ConfControlsProviderProps {
    children: React.ReactNode
}

export const ConfControlsProvider = ({ children }: ConfControlsProviderProps) => {
    const [opened, setOpened] = useState(false)
    const { accessToken, refreshToken } = useTokensData()

    if (!accessToken || !refreshToken) return children

    return <>
        {createPortal(<ConferenceControls opened={opened} onClose={() => setOpened(false)} />, document.body)}
        {createPortal(<div className={cls.confControlsSwitcher} onMouseEnter={() => setOpened(true)} >
            <div className={cls.confControlsSwitcherLine}></div>
        </div>, document.body)}
        {children}
    </>
}
