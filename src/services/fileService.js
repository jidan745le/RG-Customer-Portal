import apiClient from '../utils/apiClient';

/**
 * 上传文件
 * @param {File} file - 要上传的文件
 * @param {string} type - 文件类型，如'logo'、'avatar'等
 * @returns {Promise<string>} - 返回上传后的文件URL
 */
export const uploadFile = async (file, type = 'logo') => {
    if (!file) {
        throw new Error('No file to upload');
    }

    // 创建FormData对象
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', type);

    try {
        // 发送文件上传请求
        const response = await apiClient.post('/files/upload', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // 返回文件URL
        return response.data.url;
    } catch (error) {
        console.error('File upload failed:', error);
        throw error;
    }
}; 