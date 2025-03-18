import React from 'react';
import Logo from '../components/Logo';
import LanguageSelector from '../components/LanguageSelector';
import LoginForm from '../components/LoginForm';
import styles from '../styles/LoginPage.module.css';
import bgImage from '../assets/images/rg_bg.png';

const LoginPage = () => {

  return (
    <div className={styles.pageContainer}>
      <div className={styles.loginSide}>
        <LanguageSelector />
        <div className={styles.loginContent}>
          <Logo />
          <LoginForm />
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