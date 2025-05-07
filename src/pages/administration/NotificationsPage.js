import React from 'react';
import styles from '../../styles/pages/AdministrationPage.module.css';

const NotificationsPage = () => {
    return (
        <div>
            <h1 className={styles.title}>Notifications</h1>
            <div className={styles.contentContainer}>
                <div className={styles.notificationSection}>
                    <h2>Notification Templates</h2>
                    <div className={styles.notificationTools}>
                        <button className={styles.actionButton}>Create Template</button>
                        <button className={styles.actionButton}>Send Test</button>
                    </div>

                    <div className={styles.notificationList}>
                        <p>Notification management functionality will be implemented here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotificationsPage; 