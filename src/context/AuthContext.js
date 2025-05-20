import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import CookieService from '../utils/cookieService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [returnUrl, setReturnUrl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const returnUrlParam = params.get('returnUrl');
        if (returnUrlParam) {
            setReturnUrl(returnUrlParam);
            console.log('returnUrlParam', returnUrlParam);
        }
    }, [location]);

    useEffect(() => {
        // 从cookie中检查认证状态
        const storedToken = CookieService.getToken();
        const userInfo = CookieService.getUserInfo();

        if (storedToken) {
            setToken(storedToken);
            setIsAuthenticated(true);
            if (userInfo) {
                setUser(userInfo);
            }
        } else {
            setToken(null);
            setIsAuthenticated(false);
            setUser(null);
        }

        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await apiClient.post('/login', credentials);
            const { token: newToken, user: userData } = response.data;

            // 使用CookieService保存token和用户信息
            CookieService.setToken(newToken);
            CookieService.setUserInfo(userData);

            // 更新状态
            setToken(newToken);
            setIsAuthenticated(true);
            setUser(userData);
            setLoading(false);

            // 处理登录成功后的重定向
            if (returnUrl) {
                setTimeout(() => {
                    window.location.href = returnUrl;
                });
            } else {
                console.log('Navigating to dashboard...');
                // 增加延迟确保状态更新后再跳转
                setTimeout(() => {
                    navigate('/dashboard');
                }, 100);
            }
            return true;
        } catch (error) {
            setLoading(false);
            console.error('Login failed:', error);
            throw error; // 将错误抛出，以便在LoginForm中捕获
        }
    };

    const logout = () => {
        // 使用CookieService清除认证信息
        CookieService.logout();

        // 重置状态
        setToken(null);
        setIsAuthenticated(false);
        setUser(null);

        // 跳转至登录页
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 