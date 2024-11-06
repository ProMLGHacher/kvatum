import { WorkSpacesList } from '@/features/workSpaces/ui/WorkSpacesList/WorkSpacesList'
import cls from './WorkSpace.module.scss'
import { useParams, Outlet, Navigate, useNavigate } from 'react-router-dom'
import { HubId, useHubs } from '@/entities/useHub'
import { useEffect } from 'react'
import { setCurrentHubAction } from '@/features/hubs/model/setCurrentHub/setCurrentHub'
import { useWorkSpace } from '@/entities/useWorkSpcae'

export const WorkSpacePage = () => {

    const { workspaceId } = useParams()
    const { currentHub } = useHubs()
    const { currentWorkSpace } = useWorkSpace()

    const navigate = useNavigate()

    useEffect(() => {
        if (currentWorkSpace && !workspaceId) {
            navigate(`/main/hubs/${currentHub?.id}/${currentWorkSpace?.id}`)
        }
    }, [currentWorkSpace])


    if (!currentHub) {
        return <Navigate to='/main' />
    }

    return <div className={cls.serversPage}>
        <aside className={cls.serverSidebar}>
            <WorkSpacesList />
        </aside>
        <Outlet />
    </div>
}
