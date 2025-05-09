import apiClient from '../utils/apiClient';

/**
 * 获取应用配置
 * @param {string} appcode - 应用代码
 * @returns {Promise} - API响应
 */
export const getAppConfig = async (appcode, mode) => {
    try {
        const url = appcode ? `/app-config?appcode=${appcode}&mode=${mode || ''}` : '/app-config';
        const response = await apiClient.get(url);
        return response.data;
    } catch (error) {
        console.error('Failed to get app config:', error);
        throw error;
    }
};

/**
 * 更新应用配置
 * @param {Object} settingsData - 应用设置数据
 * @param {string} appcode - 应用代码
 * @returns {Promise} - API响应
 */
export const updateAppConfig = async (settingsData, appcode) => {
    try {
        const url = appcode ? `/app-config?appcode=${appcode}` : '/app-config';
        const response = await apiClient.post(url, settingsData);
        return response.data;
    } catch (error) {
        console.error('Failed to update app config:', error);
        throw error;
    }
}; 