/**
 * Cookie 服务工具类 - 处理认证token和用户信息的存储
 * 支持主子应用cookie共享和环境隔离
 */
class CookieService {
    // 定义共享token的存储键
    static TOKEN_KEY = 'authToken';
    static USER_INFO_KEY = 'userInfo';
    static DOMAIN = '.rg-experience.com'; // 默认顶级域名，用于共享cookie
    static MANUAL_DOMAIN = null; // 手动设置的域名，优先级最高

    /**
     * 检测当前是否为测试环境
     * @returns {boolean} 是否为测试环境
     */
    static isTestEnvironment() {
        const hostname = window.location.hostname;
        return hostname.includes('-test.');
    }

    /**
     * 获取环境前缀
     * @returns {string} 环境前缀
     */
    static getEnvironmentPrefix() {
        return this.isTestEnvironment() ? 'test_' : '';
    }

    /**
     * 获取带环境前缀的cookie键名
     * @param {string} key 原始键名
     * @returns {string} 带环境前缀的键名
     */
    static getEnvironmentKey(key) {
        return this.getEnvironmentPrefix() + key;
    }

    /**
     * 动态获取当前环境的cookie域名
     * @returns {string|null} 适合当前环境的cookie域名
     */
    static getCurrentDomain() {
        // 优先使用手动设置的域名
        if (this.MANUAL_DOMAIN !== null) {
            return this.MANUAL_DOMAIN;
        }

        const hostname = window.location.hostname;

        // 本地开发环境
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            return 'localhost';
        }

        // 测试和生产环境都使用顶级域名，通过key前缀区分环境
        if (hostname.endsWith('.rg-experience.com')) {
            return '.rg-experience.com';
        }

        // 其他环境使用默认域名
        return this.DOMAIN;
    }

    /**
     * 设置cookie
     * @param {string} name cookie名称
     * @param {string} value cookie值
     * @param {Object} options cookie选项
     */
    static setCookie(name, value, options = {}) {
        const currentDomain = this.getCurrentDomain();

        const defaultOptions = {
            path: '/',
            // 只有当currentDomain不为null时才设置domain
            ...(currentDomain && { domain: currentDomain }),
            // 移除secure选项，允许HTTP协议使用Cookie
            // 在生产环境中应该重新启用此选项
            // secure: window.location.protocol === 'https:',
            sameSite: 'Lax', // 允许同域请求携带cookie
            maxAge: 60 * 60 * 24 * 7 // 默认7天过期
        };

        const cookieOptions = { ...defaultOptions, ...options };
        let cookieString = `${encodeURIComponent(name)}=${encodeURIComponent(value)}`;

        for (const optionKey in cookieOptions) {
            const optionValue = cookieOptions[optionKey];
            if (optionValue === null || optionValue === undefined) continue;

            if (optionKey === 'maxAge') {
                cookieString += `;max-age=${optionValue}`;
            } else if (optionKey === 'expires' && optionValue instanceof Date) {
                cookieString += `;expires=${optionValue.toUTCString()}`;
            } else if (optionKey === 'secure' && optionValue) {
                cookieString += ';secure';
            } else if (optionKey === 'sameSite') {
                cookieString += `;samesite=${optionValue}`;
            } else {
                cookieString += `;${optionKey}=${optionValue}`;
            }
        }

        document.cookie = cookieString;

        const env = this.isTestEnvironment() ? 'TEST' : 'PROD';
        const domainInfo = currentDomain ? ` with domain: ${currentDomain}` : ' (no domain - current only)';
        console.log(`[${env}] Cookie set: ${name}=${value.substring(0, 10)}...${domainInfo}`);
    }

    /**
     * 获取cookie
     * @param {string} name cookie名称
     * @returns {string|null} cookie值或null
     */
    static getCookie(name) {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            const [cookieName, cookieValue] = cookie.split('=');
            if (decodeURIComponent(cookieName) === name) {
                return decodeURIComponent(cookieValue || '');
            }
        }

        const env = this.isTestEnvironment() ? 'TEST' : 'PROD';
        console.log(`[${env}] Cookie not found: ${name}`);
        return null;
    }

    /**
     * 删除cookie
     * @param {string} name cookie名称
     */
    static deleteCookie(name) {
        const currentDomain = this.getCurrentDomain();

        // 删除cookie最可靠的方法是将其设置为过期
        this.setCookie(name, '', {
            maxAge: -1, // 立即过期
            ...(currentDomain && { domain: currentDomain }),
            path: '/'
        });

        const env = this.isTestEnvironment() ? 'TEST' : 'PROD';
        console.log(`[${env}] Cookie deleted: ${name}`);
    }

    /**
     * 设置token到cookie
     * @param {string} token JWT token
     */
    static setToken(token) {
        this.setCookie(this.getEnvironmentKey(this.TOKEN_KEY), token);
        return true;
    }

    /**
     * 从cookie获取token
     * @returns {string|null} JWT token或null
     */
    static getToken() {
        return this.getCookie(this.getEnvironmentKey(this.TOKEN_KEY));
    }

    /**
     * 设置用户信息到cookie
     * @param {Object} userInfo 用户信息对象
     */
    static setUserInfo(userInfo) {
        try {
            const userInfoStr = JSON.stringify(userInfo);
            this.setCookie(this.getEnvironmentKey(this.USER_INFO_KEY), userInfoStr);
            return true;
        } catch (error) {
            console.error('Failed to save user info to cookie:', error);
            return false;
        }
    }

    /**
     * 从cookie获取用户信息
     * @returns {Object|null} 用户信息对象或null
     */
    static getUserInfo() {
        try {
            const userInfoStr = this.getCookie(this.getEnvironmentKey(this.USER_INFO_KEY));
            if (!userInfoStr) return null;
            return JSON.parse(userInfoStr);
        } catch (error) {
            console.error('Failed to parse user info from cookie:', error);
            return null;
        }
    }

    /**
     * 清除所有认证相关cookie
     */
    static logout() {
        this.deleteCookie(this.getEnvironmentKey(this.TOKEN_KEY));
        this.deleteCookie(this.getEnvironmentKey(this.USER_INFO_KEY));
        return true;
    }

    /**
     * 获取当前环境信息
     * @returns {Object} 环境信息
     */
    static getEnvironmentInfo() {
        const hostname = window.location.hostname;
        const isTest = this.isTestEnvironment();
        const domain = this.getCurrentDomain();
        const isManualDomain = this.MANUAL_DOMAIN !== null;
        const prefix = this.getEnvironmentPrefix();

        return {
            hostname,
            isTest,
            domain,
            isManualDomain,
            manualDomain: this.MANUAL_DOMAIN,
            environment: isTest ? 'TEST' : 'PROD',
            keyPrefix: prefix,
            tokenKey: this.getEnvironmentKey(this.TOKEN_KEY),
            userInfoKey: this.getEnvironmentKey(this.USER_INFO_KEY)
        };
    }

    /**
     * 检查用户是否已登录
     * @returns {boolean} 用户是否已登录
     */
    static isLoggedIn() {
        const token = this.getToken();
        const env = this.isTestEnvironment() ? 'TEST' : 'PROD';
        console.log(`[${env}] Login check: ${!!token}`);
        return !!token;
    }

    /**
     * 为特定环境设置域名
     * @param {string|null} domain 使用的域名，null表示不设置domain
     */
    static setDomain(domain) {
        this.MANUAL_DOMAIN = domain;
        console.log(`Cookie domain manually set to: ${domain || 'null (current domain only)'}`);

        // 打印当前生效的域名
        const currentDomain = this.getCurrentDomain();
        console.log(`Current effective domain: ${currentDomain || 'null (current domain only)'}`);
    }

    /**
     * 重置为自动域名检测
     */
    static resetDomain() {
        this.MANUAL_DOMAIN = null;
        console.log('Cookie domain reset to auto-detection');

        // 打印当前生效的域名
        const currentDomain = this.getCurrentDomain();
        console.log(`Current effective domain: ${currentDomain || 'null (current domain only)'}`);
    }

    /**
     * 获取当前使用的域名
     * @returns {string|null} 当前cookie域名
     */
    static getDomain() {
        return this.getCurrentDomain();
    }
}

// 本地开发环境自动配置
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    CookieService.setDomain('localhost');
}

// 启动时打印环境信息
console.log('CookieService Environment Info:', CookieService.getEnvironmentInfo());

export default CookieService; 