import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../styles/components/layout/AdminLayout.module.css';
import AdminSidebar from '../AdminSidebar';

const AdminLayout = () => {
    return (
        <div className={styles.adminLayoutContainer}>
            <div className={styles.sidebarContainer}>
                <AdminSidebar />
            </div>
            <div className={styles.contentContainer}>
                <Outlet />
            </div>
        </div>
    );
};

export default AdminLayout; 