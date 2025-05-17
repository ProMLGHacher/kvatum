import { PopUp } from "@/shared/ui/PopUp/PopUp/PopUp"
import cls from "./CreateWorkSpaceButton.module.scss"
import { useState } from "react"
import Button from "@/shared/ui/Button/Button"
import Input from "@/shared/ui/Input/Input"
import { createWorkSpaceAction } from "../../model/createWorkSpace/createWorkSpace"
import { useParams } from "react-router"
import { HubId } from "@/entities/hubs"

export const CreateWorkSpaceButton = () => {
  const { hubId } = useParams()

  const [isOpenCreateWorkSpaceModal, setIsOpenCreateWorkSpaceModal] =
    useState(false)
  const [workSpaceName, setWorkSpaceName] = useState("")

  const handleCreateWorkSpace = async () => {
    if (!hubId) return
    if (!workSpaceName.trim()) return
    await createWorkSpaceAction({ name: workSpaceName, hubId: hubId as HubId })
    setIsOpenCreateWorkSpaceModal(false)
    setWorkSpaceName("")
  }

  return (
    <>
      <PopUp
        isOpened={isOpenCreateWorkSpaceModal}
        onClose={() => setIsOpenCreateWorkSpaceModal(false)}
      >
        <div className={cls.createHub}>
          <h2>Create WorkSpace</h2>
          <p>Create a new workSpace to start collaborating with your team.</p>
          <Input
            value={workSpaceName}
            style={{}}
            onChange={(e) => setWorkSpaceName(e.target.value)}
            placeholder="Enter workSpace name"
          />
          <Button onClick={handleCreateWorkSpace}>Create WorkSpace</Button>
        </div>
      </PopUp>
      <button
        className={cls.createHubButton}
        onClick={() => setIsOpenCreateWorkSpaceModal(true)}
      >
        +
      </button>
    </>
  )
}
