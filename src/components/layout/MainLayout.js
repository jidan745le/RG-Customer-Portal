import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styles from '../../styles/layout/MainLayout.module.css';
import Footer from './Footer';
import Header from './Header';

const MainLayout = () => {
    const location = useLocation();

    // 检查当前路径是否属于administration
    const isAdministrationPage = location.pathname.includes('/administration');

    return (
        <div className={styles.container}>
            <Header isPublic={false} />
            <main className={styles.mainContent}>
                {isAdministrationPage ? (
                    <div className={styles.administrationContent}>
                        <Outlet />
                    </div>
                ) : (
                    <Outlet />
                )}
            </main>
            {!isAdministrationPage && <Footer />}
        </div>
    );
};

export default MainLayout; 