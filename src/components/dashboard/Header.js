import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/dashboard/Header.module.css';
import Logo from '../Logo'; // 复用之前的Logo组件
import LanguageSelector from '../LanguageSelector'; // 复用之前的语言选择器

const Header = ({ user, onLogout }) => {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.leftSection}>
                <Logo />
                <nav className={styles.navigation}>
                    {/* 根据截图添加导航链接 */}
                    <Link to="/dashboard" className={styles.navLink}>Home</Link>
                    <Link to="/marketplace" className={styles.navLink}>Marketplace</Link>
                    <Link to="/user-management" className={styles.navLink}>User management</Link>
                    <Link to="/administration" className={styles.navLink}>Administration</Link>
                    <Link to="/support" className={styles.navLink}>Support</Link>
                    <Link to="/subscription" className={styles.navLink}>Subscription</Link>
                </nav>
            </div>
            <div className={styles.rightSection}>
                <LanguageSelector />
                <div className={styles.userMenu}>
                    <span className={styles.userName}>{user?.name || 'User'}</span>
                    <button onClick={onLogout} className={styles.logoutButton}>Logout</button>
                </div>
                {/* 可以添加其他图标按钮，如消息通知等 */}
            </div>
        </header>
    );
};

export default Header; 