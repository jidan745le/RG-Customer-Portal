import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import styles from '../../styles/dashboard/YourApps.module.css';

// 简单的SVG占位符图标
const PlaceholderIcon = () => (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="48" height="48" rx="8" fill="#E0E0E0" />
        <path d="M16 16h16v16H16z" fill="#BDBDBD" />
    </svg>
);

const YourApps = () => {
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    useEffect(() => {
        const fetchApps = async () => {
            try {
                setLoading(true);
                const response = await apiClient.get('/sub-applications');
                setApps(response.data || []); // 确保是数组
                setError(null);
            } catch (err) {
                console.error("Failed to fetch sub applications:", err);
                setError('无法加载您的应用列表，请稍后重试。');
                setApps([]); // 出错时设置为空数组
            } finally {
                setLoading(false);
            }
        };

        fetchApps();
    }, []);

    return (
        <div className={styles.yourAppsContainer}>
            <div className={styles.header}>
                <h2>Your Apps</h2>
                <div className={styles.viewToggle}>
                    <button
                        onClick={() => setViewMode('list')}
                        className={viewMode === 'list' ? styles.active : ''}
                        aria-label="List view"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5z" /></svg>
                    </button>
                    <button
                        onClick={() => setViewMode('grid')}
                        className={viewMode === 'grid' ? styles.active : ''}
                        aria-label="Grid view"
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path d="M1 2.5A1.5 1.5 0 0 1 2.5 1h3A1.5 1.5 0 0 1 7 2.5v3A1.5 1.5 0 0 1 5.5 7h-3A1.5 1.5 0 0 1 1 5.5v-3zm8 0A1.5 1.5 0 0 1 10.5 1h3A1.5 1.5 0 0 1 15 2.5v3A1.5 1.5 0 0 1 13.5 7h-3A1.5 1.5 0 0 1 9 5.5v-3zm-8 8A1.5 1.5 0 0 1 2.5 9h3A1.5 1.5 0 0 1 7 10.5v3A1.5 1.5 0 0 1 5.5 15h-3A1.5 1.5 0 0 1 1 13.5v-3zm8 0A1.5 1.5 0 0 1 10.5 9h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3A1.5 1.5 0 0 1 9 13.5v-3z" /></svg>
                    </button>
                </div>
            </div>

            {loading && <div className={styles.loading}>加载应用中...</div>}
            {error && <div className={styles.error}>{error}</div>}

            {!loading && !error && (
                <div className={`${styles.appsList} ${viewMode === 'grid' ? styles.grid : styles.list}`}>
                    {apps.length > 0 ? (
                        apps.map((app) => (
                            <a
                                href={app.url || '#'} // 使用app.url，如果没有则为#
                                key={app.id}
                                className={styles.appItem}
                                target="_blank" // 在新标签页打开
                                rel="noopener noreferrer"
                                title={app.description || app.name} // 添加描述作为title
                            >
                                <div className={styles.appIcon}>
                                    {app.iconUrl ? <img src={app.iconUrl} alt={`${app.name} icon`} /> : <PlaceholderIcon />}
                                </div>
                                <div className={styles.appDetails}>
                                    <h3 className={styles.appName}>{app.name}</h3>
                                    {/* 可以添加描述或其他信息 */}
                                    {/* <p className={styles.appDescription}>{app.description || '子应用描述'}</p> */}
                                    <p className={styles.appType}>{app.code || 'Sub App'} </p> { /* 显示app code 或 类型 */}
                                </div>
                            </a>
                        ))
                    ) : (
                        <div className={styles.noApps}>您目前没有可访问的应用。</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default YourApps; 