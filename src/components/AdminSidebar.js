import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../styles/AdminSidebar.module.css';

const AdminSidebar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const currentPath = location.pathname;

    // Initialize with the configuration
    const [menuItems, setMenuItems] = useState([
        {
            id: 'portal',
            label: 'Portal Administration',
            icon: '⚙️',
            active: true,
            collapsed: false,
            subItems: [
                { id: 'basic', label: 'Look & Feel', path: '/administration/basic' },
                { id: 'users', label: 'User Management', path: '/administration/users' },
                { id: 'content', label: 'Content Management', path: '/administration/content' },
                { id: 'notifications', label: 'Notifications', path: '/administration/notifications' },
            ]
        },
        {
            id: 'user',
            label: 'User Management',
            icon: '👥',
            active: false,
            collapsed: true,
            subItems: [
                { id: 'roles', label: 'Roles & Permissions', path: '/administration/users' },
                { id: 'groups', label: 'User Groups', path: '/administration/users' }
            ]
        }
    ]);

    const handleItemClick = (item) => {
        if (item.path) {
            navigate(item.path);
        }
    };

    const toggleCollapse = (itemId) => {
        setMenuItems(menuItems.map(item =>
            item.id === itemId
                ? { ...item, collapsed: !item.collapsed }
                : item
        ));
    };

    return (
        <div className={styles.sidebar}>
            {menuItems.map((item) => (
                <div key={item.id} className={styles.sidebarSection}>
                    <div
                        className={`${styles.sidebarHeader} ${item.active ? styles.active : ''}`}
                        onClick={() => toggleCollapse(item.id)}
                    >
                        <div className={styles.headerIcon}>{item.icon}</div>
                        <div className={styles.headerLabel}>{item.label}</div>
                    </div>

                    {!item.collapsed && (
                        <div className={styles.subItems}>
                            {item.subItems.map((subItem) => (
                                <div
                                    key={subItem.id}
                                    className={`${styles.subItem} ${currentPath === subItem.path ? styles.activeSubItem : ''}`}
                                    onClick={() => handleItemClick(subItem)}
                                >
                                    {subItem.label}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AdminSidebar; 