import React from 'react';
import bgImage from '../assets/images/rg_bg.png';
import LanguageSelector from '../components/LanguageSelector';
import LoginForm from '../components/LoginForm';
import Logo from '../components/Logo';
import styles from '../styles/LoginPage.module.css';

const LoginPage = () => {

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginSide}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 3 }}>
          <div className={styles.topRow}>
            <Logo size='80px' />
            <LanguageSelector />
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 7 }}>
          <div className={styles.loginContent}>
            <LoginForm />
          </div>
        </div>
      </div>
      <div
        className={styles.imageSide}
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        {/* Background image is set via inline style */}
      </div>
    </div>
  );
};

export default LoginPage;