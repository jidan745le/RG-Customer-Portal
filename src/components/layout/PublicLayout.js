import React from 'react';
import { Outlet } from 'react-router-dom';
import styles from '../../styles/layout/MainLayout.module.css';
import Footer from './Footer';
import Header from './Header';

const PublicLayout = () => {
    // 与MainLayout使用相同的样式和组件，但可以根据需要定制不同的行为
    return (
        <div className={styles.container}>
            <Header isPublic={true} />
            <main className={styles.mainContent}>
                <Outlet />
            </main>
            <Footer />
        </div>
    );
};

export default PublicLayout; 