import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import bgImage from '../assets/images/rg_bg.png';
import LanguageSelector from '../components/LanguageSelector';
import Logo from '../components/Logo';
import styles from '../styles/VerificationPage.module.css';
import apiClient from '../utils/apiClient';

const EmailVerificationPage = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [verificationStatus, setVerificationStatus] = useState('ready'); // ready, verifying, success, error, expired, already_verified
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const token = searchParams.get('token');

    useEffect(() => {
        // Check if token exists, if not redirect to error state
        if (!token) {
            setVerificationStatus('error');
            setErrorMessage('Invalid verification link. No token provided.');
        }
    }, [token]);

    const handleConfirmVerification = async () => {
        if (!token) return;

        setIsLoading(true);
        setVerificationStatus('verifying');

        try {
            // Call your backend API
            const response = await apiClient.post('/verify-email', {
                token: token
            });

            const data = await response.data;

            if (response.status === 200 || response.status === 201) {
                // Verification successful
                setVerificationStatus('success');

                // Store verification success in localStorage
                localStorage.setItem('emailVerified', 'true');
                localStorage.setItem('verificationMessage', data.message);
            } else {
                // Handle specific error messages from backend
                if (data.message === 'Verification token has expired') {
                    setVerificationStatus('expired');
                } else if (data.message === 'Email already verified') {
                    setVerificationStatus('already_verified');
                } else {
                    setVerificationStatus('error');
                    setErrorMessage(data.message || 'Verification failed');
                }
            }
        } catch (error) {
            console.error('Verification error:', error);
            setVerificationStatus('error');
            setErrorMessage('Network error. Please check your connection and try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLoginRedirect = () => {
        // Redirect to login page
        navigate('/');
    };

    const handleResendVerification = () => {
        navigate('/verification-sent');
    };

    const renderContent = () => {
        switch (verificationStatus) {
            case 'ready':
                return (
                    <div className={styles.verificationContainer}>
                        {/* <div className={styles.iconContainer}>
                            <div className={styles.emailIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="#e53935" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="22,6 12,13 2,6" stroke="" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div> */}

                        <h2 className={styles.title}>Confirm Your Email Address</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                Please click the button below to verify your email address and activate your account.
                            </p>
                        </div>

                        <button
                            className={styles.confirmButton}
                            onClick={handleConfirmVerification}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Confirm Email Address'}
                        </button>

                        <div className={styles.linkContainer}>
                            <Link to="/" className={styles.backLink}>
                                Back to Login
                            </Link>
                        </div>
                    </div>
                );

            case 'verifying':
                return (
                    <div className={styles.verificationContainer}>
                        <div className={styles.iconContainer}>
                            <div className={styles.loadingIcon}>
                                <div className={styles.spinner}></div>
                            </div>
                        </div>
                        <h2 className={styles.title}>Verifying Your Email...</h2>
                        <p className={styles.message}>
                            Please wait while we verify your email address.
                        </p>
                    </div>
                );

            case 'success':
                return (
                    <div className={styles.verificationContainer}>
                        <div className={styles.iconContainer}>
                            <div className={styles.successIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4906 2.02168 11.3407C2.16356 9.19077 2.99721 7.14613 4.39828 5.49707C5.79935 3.84801 7.69279 2.68842 9.79619 2.1787C11.8996 1.66899 14.1003 1.83209 16.1 2.64919" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="22,4 12,14.01 9,11.01" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <h2 className={styles.title}>Email Verified Successfully!</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                Your email address has been verified successfully. Your account is now active and you can log in.
                            </p>
                        </div>

                        <button
                            className={styles.confirmButton}
                            onClick={handleLoginRedirect}
                        >
                            Go to Login
                        </button>
                    </div>
                );

            case 'already_verified':
                return (
                    <div className={styles.verificationContainer}>
                        <div className={styles.iconContainer}>
                            <div className={styles.successIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.7088 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4906 2.02168 11.3407C2.16356 9.19077 2.99721 7.14613 4.39828 5.49707C5.79935 3.84801 7.69279 2.68842 9.79619 2.1787C11.8996 1.66899 14.1003 1.83209 16.1 2.64919" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    <polyline points="22,4 12,14.01 9,11.01" stroke="#4CAF50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <h2 className={styles.title}>Email Already Verified</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                Your email address has already been verified. You can log in to your account.
                            </p>
                        </div>

                        <button
                            className={styles.confirmButton}
                            onClick={handleLoginRedirect}
                        >
                            Go to Login
                        </button>
                    </div>
                );

            case 'expired':
                return (
                    <div className={styles.verificationContainer}>
                        <div className={styles.iconContainer}>
                            <div className={styles.errorIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#f44336" strokeWidth="2" />
                                    <path d="M15 9L9 15M9 9L15 15" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <h2 className={styles.title}>Verification Link Expired</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                This email verification link has expired. Please request a new verification email.
                            </p>
                        </div>

                        <div className={styles.actionButtons}>
                            <button
                                className={styles.resendButton}
                                onClick={handleResendVerification}
                            >
                                Request New Verification Email
                            </button>
                        </div>

                        <div className={styles.linkContainer}>
                            <Link to="/signup" className={styles.backLink}>
                                Back to Sign Up
                            </Link>
                        </div>
                    </div>
                );

            case 'error':
            default:
                return (
                    <div className={styles.verificationContainer}>
                        <div className={styles.iconContainer}>
                            <div className={styles.errorIcon}>
                                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="12" r="10" stroke="#f44336" strokeWidth="2" />
                                    <path d="M15 9L9 15M9 9L15 15" stroke="#f44336" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>

                        <h2 className={styles.title}>Verification Failed</h2>

                        <div className={styles.messageContainer}>
                            <p className={styles.message}>
                                {errorMessage || 'We couldn\'t verify your email address. The link may be invalid or expired.'}
                            </p>
                        </div>

                        <div className={styles.actionButtons}>
                            <button
                                className={styles.resendButton}
                                onClick={handleResendVerification}
                            >
                                Request New Verification Email
                            </button>
                        </div>

                        <div className={styles.linkContainer}>
                            <Link to="/signup" className={styles.backLink}>
                                Back to Sign Up
                            </Link>
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.contentSide}>
                <LanguageSelector />
                <div className={styles.content}>
                    <Logo />
                    {renderContent()}
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

export default EmailVerificationPage; 