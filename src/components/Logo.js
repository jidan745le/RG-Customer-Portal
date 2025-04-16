import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Logo.module.css';
import logoImage from '../assets/images/logo.png';

const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      <img style={{ width: '80px' }} src={logoImage} alt="Logo" className={styles.logoImage} />
    </Link>
  );
};

export default Logo; 