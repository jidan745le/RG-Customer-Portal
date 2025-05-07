import React from 'react';
import styles from '../../styles/pages/AdministrationPage.module.css';

const UserManagementPage = () => {
    return (
        <div>
            <h1 className={styles.title}>User Management</h1>
            <div className={styles.contentContainer}>
                <div className={styles.userManagementSection}>
                    <h2>User List</h2>
                    <div className={styles.userTable}>
                        <div className={styles.userTableHeader}>
                            <div className={styles.userTableHeaderItem}>User Name</div>
                            <div className={styles.userTableHeaderItem}>Email</div>
                            <div className={styles.userTableHeaderItem}>Role</div>
                            <div className={styles.userTableHeaderItem}>Status</div>
                            <div className={styles.userTableHeaderItem}>Actions</div>
                        </div>

                        <div className={styles.userTableBody}>
                            <p>User management functionality will be implemented here.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagementPage; 