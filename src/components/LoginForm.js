import { Alert } from 'antd';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import styles from '../styles/LoginForm.module.css';
import CookieService from '../utils/cookieService';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 调用login方法，传入登录凭据
      const loginResult = await login({ email, password });

      // 如果login返回false，说明是特殊情况（如账户未激活），已经被处理了，不需要继续
      if (loginResult === false) {
        setLoading(false);
        return;
      }

      // 如果用户选择"记住我"，将Cookie有效期延长到30天
      if (rememberMe) {
        // 获取当前token并重新设置为30天有效期
        const token = CookieService.getToken();
        if (token) {
          CookieService.setCookie(CookieService.TOKEN_KEY, token, {
            maxAge: 60 * 60 * 24 * 30 // 30天
          });

          // 用户信息也同样延长
          const userInfo = CookieService.getUserInfo();
          if (userInfo) {
            CookieService.setCookie(
              CookieService.USER_INFO_KEY,
              JSON.stringify(userInfo),
              { maxAge: 60 * 60 * 24 * 30 }
            );
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || '登录失败，请检查邮箱和密码');
      setLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // 清除可能存在的错误提示
    if (error) setError(null);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // 清除可能存在的错误提示
    if (error) setError(null);
  };

  return (
    <div className={styles.formContainer}>
      <div className={styles.welcomeText} style={{ width: '100%' }}>
        <p>Welcome to the</p>
        <h1>RG Customer Portal</h1>
      </div>

      {error && (
        <Alert
          message={error}
          type="error"
          style={{ borderRadius: '0px', marginBottom: '24px' }}
          showIcon
          closable
          onClose={() => setError(null)}
        />
      )}

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.558Z" />
            </svg>
          </div>
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={handleEmailChange}
            required
            autoComplete="email"
            minLength={5}
          />
        </div>

        <div className={styles.inputGroup}>
          <div className={styles.inputIcon}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z" />
            </svg>
          </div>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
            required
            autoComplete="current-password"
            minLength={6}
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

        <button type="submit" className={styles.loginButton} disabled={loading}>
          {loading ? 'Logging in...' : 'LOGIN'}
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