import cls from "./ConferenceWindowStateChangeWidget.module.scss"

import { BsLayoutTextWindowReverse } from "react-icons/bs"
import Button from "@/shared/ui/Button/Button"
import { BsLayoutTextWindow } from "react-icons/bs"
import { hubsContentWindowsState } from "../model/hubsContentWindowsState"

export const ConferenceWindowStateChangeWidget = () => {
  const { chatIsOpen, conferenceIsOpen, setChatIsOpen, setConferenceIsOpen } =
    hubsContentWindowsState()

  return (
    <div className={cls.serverInfoHeaderButtons}>
      <Button
        style={{ opacity: conferenceIsOpen ? 1 : 0.5 }}
        onClick={() => setConferenceIsOpen(!conferenceIsOpen)}
      >
        <BsLayoutTextWindowReverse />
      </Button>
      <Button
        style={{ opacity: chatIsOpen ? 1 : 0.5 }}
        onClick={() => setChatIsOpen(!chatIsOpen)}
      >
        <BsLayoutTextWindow />
      </Button>
    </div>
  )
}
