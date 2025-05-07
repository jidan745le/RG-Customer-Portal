import React from 'react';
import styles from '../../styles/pages/AdministrationPage.module.css';

const ContentManagementPage = () => {
    return (
        <div>
            <h1 className={styles.title}>Content Management</h1>
            <div className={styles.contentContainer}>
                <div className={styles.contentSection}>
                    <h2>Portal Content Management</h2>
                    <div className={styles.contentTools}>
                        <button className={styles.actionButton}>Add New Page</button>
                        <button className={styles.actionButton}>Manage Categories</button>
                    </div>

                    <div className={styles.contentList}>
                        <p>Content management functionality will be implemented here.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentManagementPage; 