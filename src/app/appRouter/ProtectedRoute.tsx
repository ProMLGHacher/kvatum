// ProtectedRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { UserRole, useUserData } from '@/entities/useUserData';

interface ProtectedRouteProps {
    element: React.ReactNode
    roles?: UserRole[]
    redirect?: string
    skeleton?: React.ReactNode
}

const ProtectedRoute = ({ element, roles, redirect = '/main' }: ProtectedRouteProps) => {

    const { role } = useUserData()

    if (!role) {
        return <Navigate to={redirect} replace />;
    }

    if (!roles) {
        return element
    }

    if (roles.includes(role)) {
        return element
    }

    return <Navigate to={redirect} replace />;
};

export default ProtectedRoute;
