import React from 'react';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/DashboardPage.module.css';
import Header from '../components/dashboard/Header';
import YourApps from '../components/dashboard/YourApps';
import RGInsights from '../components/dashboard/RGInsights';
import RGChannelsLinks from '../components/dashboard/RGChannelsLinks';
import FAQ from '../components/dashboard/FAQ';
import Footer from '../components/dashboard/Footer';

const DashboardPage = () => {
    const { user, logout } = useAuth();

    if (!user) {
        // 理论上不应该发生，因为有路由保护
        // 但可以加个回退
        return <div>Loading user data or not logged in...</div>;
    }

    return (
        <div className={styles.dashboardContainer}>
            <Header user={user} onLogout={logout} />
            <main className={styles.mainContent}>
                {/* Top Section (placeholder for Marketplace/Expert Network if needed) */}
                <div className={styles.topSectionPlaceholder}></div>

                {/* Main Grid Layout */}
                <div className={styles.gridContainer}>
                    <div className={styles.leftColumn}>
                        <YourApps />
                    </div>
                    <div className={styles.rightColumn}>
                        <RGInsights />
                        <RGChannelsLinks />
                    </div>
                </div>

                {/* FAQ Section */}
                <FAQ />
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage; 