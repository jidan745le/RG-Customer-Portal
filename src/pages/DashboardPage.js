import React from 'react';
import { Link } from 'react-router-dom';
import FAQ from '../components/dashboard/FAQ';
import RGChannelsLinks from '../components/dashboard/RGChannelsLinks';
import RGInsights from '../components/dashboard/RGInsights';
import YourApps from '../components/dashboard/YourApps';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/DashboardPage.module.css';

const DashboardPage = () => {
    const { user } = useAuth();

    if (!user) {
        // 理论上不应该发生，因为有路由保护
        // 但可以加个回退
        return <div>Loading user data or not logged in...</div>;
    }

    return (
        <>
            {/* Top Section with Marketplace Link */}
            <div className={styles.topSection}>
                <div className={styles.marketplacePromo}>
                    <h2>Product Experience Alliance</h2>
                    <p>Visit our marketplace to find tools & experts to streamline your product experience</p>
                    <Link to="/marketplace" className={styles.marketplaceButton}>
                        Visit Marketplace
                    </Link>
                </div>
            </div>

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
        </>
    );
};

export default DashboardPage; 