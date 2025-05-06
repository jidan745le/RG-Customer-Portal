import React from 'react';
import styles from '../../styles/marketplace/Footer.module.css';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContent}>
                <p className={styles.copyright}>
                    © {currentYear} Product Experience Alliance. All rights reserved.
                </p>
                <div className={styles.footerLinks}>
                    <a href="#terms">Terms of Service</a>
                    <a href="#privacy">Privacy Policy</a>
                    <a href="#cookie">Cookie Policy</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 