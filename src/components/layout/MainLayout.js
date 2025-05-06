import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../styles/layout/MainLayout.module.css';
import Footer from './Footer';
import Header from './Header';

const MainLayout = () => {
    return (
        <div className={styles.container}>
            <Header isPublic={false} />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default MainLayout; 