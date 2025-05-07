import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/layout/Header.module.css';
import LanguageSelector from '../LanguageSelector';
import Logo from '../Logo';

const Header = ({ isPublic = false }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const isLoggedIn = !!user;

    const navItems = [
        { path: '/dashboard', label: 'Home', requiresAuth: true },
        { path: '/marketplace', label: 'Marketplace', requiresAuth: false },
        { path: '/user-management', label: 'User management', requiresAuth: true },
        { path: '/administration', label: 'Administration', requiresAuth: true },
        { path: '/support', label: 'Support', requiresAuth: true },
        { path: '/subscription', label: 'Subscription', requiresAuth: true }
    ];

    // 筛选可见菜单项
    const visibleNavItems = navItems.filter(item =>
        isLoggedIn ? true : !item.requiresAuth
    );

    return (
        <header className={styles.header}>
            <div className={styles.headerContent}>
                <div className={styles.leftSection}>
                    <Link to={isLoggedIn ? "/dashboard" : "/"} className={styles.logoLink}>
                        <Logo />
                    </Link>
                    <nav className={styles.navigation}>
                        {visibleNavItems.map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`${styles.navLink} ${location.pathname.startsWith(item.path) ? styles.active : ''}`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className={styles.rightSection}>
                    {/* <h1 className={styles.title}>PRODUCT EXPERIENCE ALLIANCE</h1> */}
                    <div className={styles.userControls}>
                        <LanguageSelector />
                        {isLoggedIn ? (
                            <div className={styles.userMenu}>
                                <span className={styles.userName}>{user.name || 'User'}</span>
                                <button onClick={logout} className={styles.logoutButton}>Logout</button>
                            </div>
                        ) : (
                            location.pathname !== '/' && location.pathname !== '/signup' && (
                                <Link to="/" className={styles.loginLink}>Login</Link>
                            )
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 