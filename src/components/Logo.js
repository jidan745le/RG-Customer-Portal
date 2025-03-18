import React from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/Logo.module.css';

const Logo = () => {
  return (
    <Link to="/" className={styles.logo}>
      <div className={styles.logoBox}>
        <span className={styles.logoText}>rg</span>
      </div>
      <div className={styles.logoName}>experience</div>
    </Link>
  );
};

export default Logo; 