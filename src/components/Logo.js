import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/Logo.png';
import styles from '../styles/Logo.module.css';

const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      <img style={{ width: '80px' }} src={logoImage} alt="Logo" className={styles.logoImage} />
    </Link>
  );
};

export default Logo; 