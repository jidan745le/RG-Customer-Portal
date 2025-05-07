import React, { useEffect, useRef, useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import styles from '../styles/pages/AdministrationPage.module.css';

const AdministrationPage = () => {
    const [activeTab, setActiveTab] = useState('basic');
    const [selectedColor, setSelectedColor] = useState('#1a3a6c'); // Default blue color
    const [logo, setLogo] = useState(null);
    const pageRef = useRef(null);

    // 控制body overflow，防止整页滚动
    useEffect(() => {
        // 保存原始样式
        const originalStyle = document.body.style.overflow;

        // 设置body不滚动
        document.body.style.overflow = 'hidden';

        // 清理函数恢复原样式
        return () => {
            document.body.style.overflow = originalStyle;
        };
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleColorSelect = (color) => {
        setSelectedColor(color);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setLogo(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const colors = [
        '#1a3a6c', '#000000', '#2b6989', '#3a5998', '#71c5fb', '#b8daff',
        '#843c39', '#ff9b9b', '#ffd5d1', '#d9d9d9', '#e6e6e6'
    ];

    return (
        <div className={styles.pageContainer}>
            <div className={styles.sidebarContainer}>
                <AdminSidebar />
            </div>

            <div className={styles.mainContent}>
                <h1 className={styles.title}>Portal Administration</h1>

                <div className={styles.tabsContainer}>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'basic' ? styles.active : ''}`}
                        onClick={() => handleTabChange('basic')}
                    >
                        Basic Settings
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'users' ? styles.active : ''}`}
                        onClick={() => handleTabChange('users')}
                    >
                        User Management
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'content' ? styles.active : ''}`}
                        onClick={() => handleTabChange('content')}
                    >
                        Content Management
                    </button>
                    <button
                        className={`${styles.tabButton} ${activeTab === 'notifications' ? styles.active : ''}`}
                        onClick={() => handleTabChange('notifications')}
                    >
                        Notifications
                    </button>
                </div>

                <div className={styles.tabContent}>
                    {activeTab === 'basic' && (
                        <div className={styles.settingsContainer}>
                            <div className={styles.settingsPanel}>
                                <h2 className={styles.settingsTitle}>Basic Settings</h2>

                                <div className={styles.settingSection}>
                                    <h3>Select color</h3>
                                    <div className={styles.colorGrid}>
                                        {colors.map((color) => (
                                            <div
                                                key={color}
                                                className={`${styles.colorOption} ${selectedColor === color ? styles.selectedColor : ''}`}
                                                style={{ backgroundColor: color }}
                                                onClick={() => handleColorSelect(color)}
                                            />
                                        ))}
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
                                            {logo ? (
                                                <img src={logo} alt="Company logo" className={styles.logoImage} />
                                            ) : (
                                                <div className={styles.emptyLogo} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={styles.previewPanel}>
                                <div className={styles.previewHeader}>
                                    <button className={styles.previewButton}>Preview</button>
                                </div>
                                <div className={styles.previewContent}>
                                    <div className={styles.previewCard} style={{ borderTop: `4px solid ${selectedColor}` }}>
                                        {logo && (
                                            <div className={styles.previewLogo}>
                                                <img src={logo} alt="Preview logo" className={styles.logoImage} />
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className={styles.comingSoon}>
                            <h2>User Management</h2>
                            <p>This feature will be available soon.</p>
                        </div>
                    )}

                    {activeTab === 'content' && (
                        <div className={styles.comingSoon}>
                            <h2>Content Management</h2>
                            <p>This feature will be available soon.</p>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className={styles.comingSoon}>
                            <h2>Notifications</h2>
                            <p>This feature will be available soon.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdministrationPage; 