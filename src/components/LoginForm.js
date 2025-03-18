import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../styles/LoginForm.module.css';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log({ username, password, rememberMe });
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.welcomeText}>
        <p>Welcome to the</p>
        <h1>RG Customer Portal</h1>
      </div>
      
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4zm-1-.004c0-.001-.001-.003-.002-.005C12.993 8.013 12.389 7 8 7s-4.993 1.013-5 2.895c-.001.002-.001.004-.002.005C3 11.44 4.22 12 8 12s5-.56 5.998-1.005z"/>
            </svg>
          </div>
          <input
            type="text"
            placeholder="User Name"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
            </svg>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        
        <div className={styles.formOptions}>
          <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <label htmlFor="rememberMe">Keep me logged in</label>
          </div>
          
          <Link to="/forgot-password" className={styles.forgotPassword}>
            Forgot password?
          </Link>
        </div>
        
        <button type="submit" className={styles.loginButton}>
          LOGIN
        </button>
        
        <div className={styles.signupPrompt}>
          <span>New User?</span>
          <Link to="/signup" className={styles.signupLink}>
            SIGN UP
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm; 