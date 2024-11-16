import { WorkSpacesList } from '@/features/workSpaces/ui/WorkSpacesList/WorkSpacesList'
import cls from './WorkSpace.module.scss'
import { useParams, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { useHubs } from '@/entities/useHub'
import { useEffect } from 'react'
import { useWorkSpace } from '@/entities/useWorkSpcae'

export const WorkSpacePage = () => {

    const { workspaceId } = useParams()
    const { currentHub } = useHubs()
    const { currentWorkSpace } = useWorkSpace()

    const navigate = useNavigate()

    useEffect(() => {
        if (currentWorkSpace && !workspaceId) {
            console.log(currentHub?.id, currentWorkSpace?.id);
            navigate(`/main/hubs/${currentHub?.id}/${currentWorkSpace?.id}`)
        }
    }, [currentWorkSpace])


    if (!currentHub) {
        console.log(currentHub);
        return <Navigate to='/main' />
    }

    return <div className={cls.serversPage}>
        <aside className={cls.serverSidebar}>
            <WorkSpacesList />
        </aside>
        <Outlet />
    </div>
}
