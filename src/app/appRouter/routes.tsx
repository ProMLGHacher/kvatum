import ChannelPage from "@/pages/ChannelPage"
import LoginPage from "@/pages/LoginPage"
import MainPage from "@/pages/main"
import RegisterPage from "@/pages/RegisterPage"
import ServerInfoPage from "@/pages/ServerInfoPage"
import HubsPage from "@/pages/HubsPage"
import WorkSpacePage from "@/pages/WorkSpacePage"
import { Route } from "./types"
import { UserRole } from "@/entities/useUserData"
import { Navigate } from "react-router-dom"
import { ProfilePage } from "@/pages/ProfilePage"
import { ChatsPage } from "@/pages/ChatsPage"
import { AcceptInvitePage } from "@/pages/AcceptInvitePage/AcceptInvitePage"


export const routes: Route[] = [
    {
        path: '/',
        element: <Navigate to='/main' />
    },
    {
        path: '/invite/:inviteHash',
        element: <AcceptInvitePage />
    },
    {
        path: '/main',
        element: <MainPage />,
        roles: [UserRole.USER, UserRole.ADMIN],
        redirect: '/login',
        children: [
            {
                path: '/main/profile',
                element: <ProfilePage />,
            },
            {
                path: '/main/hubs',
                element: <HubsPage />,
                children: [
                    {
                        path: '/main/hubs/:hubId',
                        element: <WorkSpacePage />,
                        children: [
                            {
                                path: '/main/hubs/:hubId/:workspaceId',
                                element: <ChannelPage />,
                                children: [
                                    {
                                        path: '/main/hubs/:hubId/:workspaceId/:channelId',
                                        element: <ServerInfoPage />,
                                    }
                                ]
                            }
                        ]
                    },
                ]
            },
            {
                path: '/main/chats',
                element: <ChatsPage />,
            }
        ]
    },
    {
        path: '/register',
        element: <RegisterPage />,
        redirect: '/main',
        roles: [UserRole.GUEST]
    },
    {
        path: '/login',
        element: <LoginPage />,
        redirect: '/main',
        roles: [UserRole.GUEST]
    }
]