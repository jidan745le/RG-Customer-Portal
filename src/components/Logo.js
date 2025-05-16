import React from 'react';
import { Link } from 'react-router-dom';
import logoImage from '../assets/images/Logo.png';
import styles from '../styles/Logo.module.css';

const Logo = ({ size = '64px' }) => {
  return (
    <Link to="/" className={styles.logo}>
      <img style={{ width: size }} src={logoImage} alt="Logo" className={styles.logoImage} />
    </Link>
  );
};

export default Logo; 