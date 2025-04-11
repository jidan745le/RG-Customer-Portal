import React from 'react';
import styles from '../../styles/dashboard/Footer.module.css';
import Logo from '../Logo'; // Re-use the logo

const Footer = () => {
    return (
        <footer className={styles.footerContainer}>
            <div className={styles.footerContent}>
                <div className={styles.leftSection}>
                    <Logo />
                </div>
                <div className={styles.middleSection}>
                    <div className={styles.linkColumn}>
                        <h4>Product</h4>
                        <ul>
                            <li><a href="#">Diam orci</a></li>
                            <li><a href="#">Mi feuglat</a></li>
                            <li><a href="#">Netus fermentum</a></li>
                            <li><a href="#">Suspendisse viverra</a></li>
                            <li><a href="#">Id dolor</a></li>
                            <li><a href="#">Erat mattis</a></li>
                        </ul>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>Information</h4>
                        <ul>
                            <li><a href="#">Nibh</a></li>
                            <li><a href="#">Egestas</a></li>
                            <li><a href="#">Dictum</a></li>
                        </ul>
                    </div>
                    <div className={styles.linkColumn}>
                        <h4>Company</h4>
                        <ul>
                            <li><a href="#">Id maecenas</a></li>
                            <li><a href="#">Id orci</a></li>
                            <li><a href="#">Magna ultricies</a></li>
                            <li><a href="#">Quis risus</a></li>
                        </ul>
                    </div>
                </div>
                <div className={styles.rightSection}>
                    <h4>Subscribe</h4>
                    <form className={styles.subscribeForm}>
                        <input type="email" placeholder="Email address" />
                        <button type="submit">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor"><path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z" /></svg>
                        </button>
                    </form>
                    <p className={styles.subscribeText}>
                        Gravida sed justo, justo, id est et. Amet tristique
                        convallis sed porttitor. Nisl viverra faucibus
                        fringilla magna morbi.
                    </p>
                </div>
            </div>
            <div className={styles.copyRight}>
                &copy; {new Date().getFullYear()} RG Experience. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer; 