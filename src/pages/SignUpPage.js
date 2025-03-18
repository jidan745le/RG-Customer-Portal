import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';
import LanguageSelector from '../components/LanguageSelector';
import styles from '../styles/LoginPage.module.css';

const SignUpPage = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginSide}>
        <LanguageSelector />
        <div className={styles.loginContent}>
          <Logo />
          <div style={{ textAlign: 'center' }}>
            <h2>Sign Up Page</h2>
            <p>This page is under construction.</p>
            <Link to="/" style={{ color: '#e53935', marginTop: '20px', display: 'block' }}>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
      <div className={styles.imageSide}>
        {/* Background image is set via CSS */}
      </div>
    </div>
  );
};

export default SignUpPage; 