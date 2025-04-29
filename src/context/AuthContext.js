import React, { createContext, useContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../utils/apiClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const [loading, setLoading] = useState(true); // 添加加载状态
    const [returnUrl, setReturnUrl] = useState(null);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const returnUrlParam = params.get('returnUrl');
        if (returnUrlParam) {
            setReturnUrl(returnUrlParam);
        }
    }, [location]);

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        const storedUser = localStorage.getItem('userInfo');

        if (storedToken && storedUser) {
            setToken(storedToken);
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user info from localStorage", e);
                localStorage.removeItem('authToken');
                localStorage.removeItem('userInfo');
                setToken(null);
                setUser(null);
            }
        } else {
            // 如果没有token或用户信息，确保状态被清空
            setToken(null);
            setUser(null);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const response = await apiClient.post('/login', credentials);
            const { token: newToken, user: userData } = response.data;

            localStorage.setItem('authToken', newToken);
            localStorage.setItem('userInfo', JSON.stringify(userData));
            setToken(newToken);
            setUser(userData);
            setLoading(false);

            // Handle redirection based on returnUrl
            if (returnUrl) {
                window.location.href = returnUrl;
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            setLoading(false);
            console.error('Login failed:', error);
            // 可以在这里处理登录失败的UI提示
            throw error; // 将错误抛出，以便在LoginForm中捕获
        }
    };

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userInfo');
        setToken(null);
        setUser(null);
        navigate('/'); // 登出后跳转回登录页
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
}; 