import cls from './WorkSpacesList.module.scss'
import { NavLink } from 'react-router-dom'
import { classNames } from '@/shared/lib/classNames/classNames'
import { useWorkSpace } from '@/entities/useWorkSpcae'
import { CreateWorkSpaceButton } from '../CreateWorkSpaceButton/CreateWorkSpaceButton'
import { useHubs } from '@/entities/useHub'

export const WorkSpacesList = () => {

    const { currentHub } = useHubs()
    const { workSpaceList } = useWorkSpace()

    return (
        <>
            {
                workSpaceList?.map((workSpace) => (
                    <NavLink
                        key={workSpace.id}
                        to={`/main/hubs/${currentHub?.id}/${workSpace.id}`}
                        title={workSpace.name}
                        className={({ isActive }) => classNames(cls.workSpace, { [cls.active]: isActive })}
                    >
                        {workSpace.name}
                    </NavLink>
                ))
            }
            <CreateWorkSpaceButton />
        </>
    )
}