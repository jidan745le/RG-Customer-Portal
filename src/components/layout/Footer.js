import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../../styles/layout/Footer.module.css';
import Logo from '../Logo';
import NewsletterSubscribe from '../marketplace/NewsletterSubscribe';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    const footerLinks = {
        product: [
            { label: 'Product Overview', path: '#product-overview' },
            { label: 'Features', path: '#features' },
            { label: 'Technical Specs', path: '#specs' },
            { label: 'Solutions', path: '#solutions' },
            { label: 'Case Studies', path: '#case-studies' },
            { label: 'Documentation', path: '#documentation' }
        ],
        information: [
            { label: 'Help Center', path: '#help-center' },
            { label: 'FAQ', path: '#faq' },
            { label: 'Resources', path: '#resources' }
        ],
        company: [
            { label: 'About Us', path: '#about-us' },
            { label: 'Contact', path: '#contact' },
            { label: 'Partners', path: '#partners' },
            { label: 'Careers', path: '#careers' }
        ],
        legal: [
            { label: 'Terms of Service', path: '#terms' },
            { label: 'Privacy Policy', path: '#privacy' },
            { label: 'Cookie Policy', path: '#cookies' }
        ]
    };

    return (
        <footer className={styles.footer}>
            <div className={styles.mainFooter}>
                <div className={styles.footerContainer}>
                    <div className={styles.footerColumn}>
                        <Logo variant="footer" />
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>Product</h3>
                        <ul>
                            {footerLinks.product.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>Information</h3>
                        <ul>
                            {footerLinks.information.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <h3>Company</h3>
                        <ul>
                            {footerLinks.company.map((link, index) => (
                                <li key={index}>
                                    <Link to={link.path}>{link.label}</Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.footerColumn}>
                        <NewsletterSubscribe />
                    </div>
                </div>
            </div>

            <div className={styles.subFooter}>
                <div className={styles.subFooterContent}>
                    <p className={styles.copyright}>
                        © {currentYear} Product Experience Alliance. All rights reserved.
                    </p>
                    <div className={styles.footerLinks}>
                        {footerLinks.legal.map((link, index) => (
                            <Link key={index} to={link.path}>{link.label}</Link>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer; 