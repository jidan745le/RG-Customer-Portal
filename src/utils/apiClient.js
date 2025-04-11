import axios from 'axios';

// 创建axios实例
const apiClient = axios.create({
    baseURL: '/api', // 你的NestJS API基础URL
    timeout: 5000, // 请求超时时间
    headers: {
        'Content-Type': 'application/json',
    },
});

// 请求拦截器 - 自动添加JWT Token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 响应拦截器 - 处理常见错误
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            // 处理未授权错误，例如重定向到登录页
            console.error('认证失败，请重新登录。');
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            // 可以添加重定向逻辑 window.location.href = '/login';
        } else {
            console.error('API请求出错:', error.response?.data || error.message);
        }
        return Promise.reject(error);
    }
);

export default apiClient; 