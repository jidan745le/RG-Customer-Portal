import { message } from 'antd';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import bgImage from '../assets/images/rg_bg.png';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import styles from '../styles/VerificationPage.module.css';
import apiClient from '../utils/apiClient';

const VerificationSentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [resendTimer, setResendTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [loading, setLoading] = useState(false);

    const { email, phone } = location.state || {};
    const [skipTimer, setSkipTimer] = useState(location.state?.skipTimer || false);

    useEffect(() => {
        console.log('skipTimer0', skipTimer);
        // Redirect if no email provided
        if (!email) {
            navigate('/signup');
            return;
        }
        console.log('skipTimer', skipTimer);
        // 如果skipTimer为true，直接启用重发按钮
        if (skipTimer) {
            setResendTimer(0);
            setCanResend(true);
            return;
        }
        console.log('skipTimer1', skipTimer);
        // Start countdown timer
        const timer = setInterval(() => {
            setResendTimer(prev => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [email, navigate, skipTimer]);

    const handleResendEmail = async () => {
        if (!canResend || loading) return;

        setLoading(true);
        try {
            const response = await apiClient.post('/resend-verification', {
                email: email
            });

            // Reset timer
            setResendTimer(60);
            setCanResend(false);
            if (skipTimer) {
                setSkipTimer(false);
            }

            // Show success message (you might want to add a toast notification here)
            message.success('Verification email sent successfully!');
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message || 'Failed to resend email. Please try again.';
            message.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentSide}>
                <LanguageSelector />
                <div className={styles.content}>
                    <Logo />
                    <div className={styles.verificationContainer}>
                        {/* <div className={styles.iconContainer}>
                            <div className={styles.emailIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="22,6 12,13 2,6" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div> */}

                        <h2 className={styles.title}>Verify Your E-mail Address</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                Thanks for signing up! Please follow the instructions in the verification email we've sent to
                            </p>
                            <p className={styles.email}>{email}</p>
                        </div>

                        <div className={styles.helpSection}>
                            <h3 className={styles.helpTitle}>Didn't receive an email?</h3>
                            <ul className={styles.helpList}>
                                <li>Check your spam folder. Sometimes emails end up there.</li>
                                <li>Resend the email confirmation by clicking the button below.</li>
                            </ul>

                            <button
                                className={`${styles.resendButton} ${!canResend ? styles.disabled : ''}`}
                                onClick={handleResendEmail}
                                disabled={!canResend}
                            >
                                {canResend ? 'Resend verification email' : `Resend available in 0:${resendTimer.toString().padStart(2, '0')}`}
                            </button>
                        </div>

                        <div className={styles.supportSection}>
                            <p className={styles.supportTitle}>Need help?</p>
                            <p className={styles.supportText}>
                                Contact our support team at <a href="mailto:support@rg-experience.com" className={styles.supportLink}>support@rg-experience.com</a>
                            </p>
                        </div>

                        <div className={styles.linkContainer}>
                            <Link to="/" className={styles.backLink}>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <div
                className={styles.imageSide}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div style={{
                    position: 'absolute', top: '0', left: '0', right: '0', bottom: '0', opacity: 0.48,
                    background: 'linear-gradient(60deg, rgba(211, 212, 220, 0.70) 19.78%, rgba(0, 12, 77, 0.70) 88.11%)'
                }}></div>
            </div>
        </div>
    );
};

export default VerificationSentPage; 