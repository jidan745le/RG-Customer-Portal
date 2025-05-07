import { SaveOutlined } from '@ant-design/icons';
import { Button, ColorPicker, message, Spin } from 'antd';
import React, { useEffect, useState } from 'react';
import { getAppConfig, updateAppConfig } from '../../services/configService';
import { uploadFile } from '../../services/fileService';
import styles from '../../styles/pages/AdministrationPage.module.css';

const BasicSettingsPage = ({ title }) => {
    const [selectedColor, setSelectedColor] = useState('#1a3a6c'); // Default blue color
    const [logoUrl, setLogoUrl] = useState(''); // 图片URL
    const [logoPreview, setLogoPreview] = useState(null); // 图片预览
    const [logoFile, setLogoFile] = useState(null); // 图片文件对象
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    // 加载初始设置
    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            // 获取应用配置
            const config = await getAppConfig();

            // 从响应中获取主题设置
            const themeSettings = config?.settings?.themeSetting || {};

            // 设置状态
            if (themeSettings.primaryColor) {
                setSelectedColor(themeSettings.primaryColor);
            }

            if (themeSettings.logoUrl) {
                setLogoUrl(themeSettings.logoUrl);
                setLogoPreview(themeSettings.logoUrl);
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error);
            message.error('Failed to load settings. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleColorChange = (color) => {
        setSelectedColor(color.toHexString());
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            // 保存文件对象，用于后续上传
            setLogoFile(file);

            // 创建本地预览
            const reader = new FileReader();
            reader.onload = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // 如果有新的logo文件，先上传
            let finalLogoUrl = logoUrl;
            if (logoFile) {
                setUploading(true);
                message.loading('Uploading logo...', 0);

                try {
                    finalLogoUrl = await uploadFile(logoFile);
                    setLogoUrl(finalLogoUrl); // 更新状态为新的URL
                } catch (uploadError) {
                    console.error('Logo upload failed:', uploadError);
                    message.error('Logo upload failed. Settings not saved.');
                    setSaving(false);
                    message.destroy(); // 清除所有消息
                    return;
                } finally {
                    setUploading(false);
                    message.destroy(); // 清除加载消息
                }
            }

            // 准备要保存的数据
            const settingsData = {
                themeSetting: {
                    primaryColor: selectedColor,
                    logoUrl: finalLogoUrl
                }
            };

            // 调用API保存设置
            await updateAppConfig(settingsData);

            message.success('Settings saved successfully!');

            // 清除文件对象，因为已经上传完成
            setLogoFile(null);
        } catch (error) {
            console.error('Failed to save settings:', error);

            if (error.response) {
                message.error(`Failed to save: ${error.response.data.message || 'Server error'}`);
            } else {
                message.error('Failed to save settings. Please try again.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <Spin size="large" />
                <p>Loading settings...</p>
            </div>
        );
    }

    return (
        <div>
            <h1 className={styles.title}>Portal Administration</h1>
            <div className={styles.settingsContainer}>
                <div className={styles.settingsPanel}>
                    <h2 className={styles.settingsTitle}>{title}</h2>

                    <div className={styles.settingSection}>
                        <h3>Select color</h3>
                        <div className={styles.colorPickerContainer}>
                            <ColorPicker
                                format="hex"
                                value={selectedColor}
                                onChange={handleColorChange}
                                showText
                                presets={[
                                    {
                                        label: 'Recommended',
                                        colors: [
                                            '#1a3a6c', '#000000', '#2b6989', '#3a5998',
                                            '#71c5fb', '#b8daff', '#843c39', '#ff9b9b',
                                            '#ffd5d1', '#d9d9d9', '#e6e6e6'
                                        ],
                                    },
                                ]}
                            />
                        </div>
                    </div>

                    <div className={styles.settingSection}>
                        <h3>Upload your company logo</h3>
                        <div className={styles.logoUpload}>
                            <label htmlFor="logo-upload" className={styles.uploadButton}>
                                Upload Logo
                            </label>
                            <input
                                id="logo-upload"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className={styles.fileInput}
                            />
                            <div className={styles.logoPreview}>
                                {logoPreview ? (
                                    <img src={logoPreview.startsWith('data') ? logoPreview : `/api/${logoPreview}`} alt="Company logo" className={styles.logoImage} />
                                ) : (
                                    <div className={styles.emptyLogo} />
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.actionButtons}>
                        <Button
                            type="primary"
                            icon={<SaveOutlined />}
                            onClick={handleSave}
                            size="large"
                            loading={saving || uploading}
                            disabled={uploading}
                        >
                            {saving ? 'Saving...' : uploading ? 'Uploading...' : 'Save Settings'}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BasicSettingsPage; 