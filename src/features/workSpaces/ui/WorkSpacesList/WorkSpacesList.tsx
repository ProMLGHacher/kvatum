import cls from "./WorkSpacesList.module.scss"
import { NavLink, useParams } from "react-router-dom"
import { classNames } from "@/shared/lib/classNames/classNames"
import { workSpaceStore } from "@/entities/workSpcae"
import { CreateWorkSpaceButton } from "../CreateWorkSpaceButton/CreateWorkSpaceButton"
import { HubParamsIds } from "@/features/hubs"

export const WorkSpacesList = () => {
  const { hubId } = useParams<HubParamsIds>()
  const { workSpaces } = workSpaceStore()

  if (!hubId) {
    return (
      <div>
        <h1>Вы не выбрали хаб</h1>
      </div>
    )
  }

  if (!workSpaces?.[hubId]) {
    return <h1>Пусто</h1>
  }

  const workSpaceList = Object.values(workSpaces?.[hubId])

  return (
    <>
      {workSpaceList?.map(
        (workSpace) =>
          workSpace && (
            <NavLink
              key={workSpace.id}
              to={`/main/hubs/${hubId}/${workSpace.id}`}
              title={workSpace.name}
              className={({ isActive }) =>
                classNames(cls.workSpace, { [cls.active]: isActive })
              }
            >
              {workSpace.name}
            </NavLink>
          ),
      )}
      <CreateWorkSpaceButton />
    </>
  )
}
