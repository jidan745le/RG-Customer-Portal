import React, { useState } from 'react';
import styles from '../styles/LanguageSelector.module.css';

const LanguageSelector = () => {
  const [language, setLanguage] = useState('English');
  
  return (
    <div className={styles.languageSelector}>
      <select 
        value={language} 
        onChange={(e) => setLanguage(e.target.value)}
        className={styles.select}
      >
        <option value="English">English</option>
        <option value="中文">中文</option>
        <option value="Español">Español</option>
        <option value="Français">Français</option>
      </select>
    </div>
  );
};

export default LanguageSelector; 