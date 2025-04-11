import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { token, loading } = useAuth();

    if (loading) {
        // 如果正在检查登录状态，显示加载指示器
        return <div>Loading...</div>;
    }

    if (!token) {
        // 如果没有token（未登录），重定向到登录页
        return <Navigate to="/" replace />;
    }

    // 如果已登录，渲染子路由
    return <Outlet />;
};

export default ProtectedRoute; 