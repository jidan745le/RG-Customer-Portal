/**
 * Cookie 服务工具类 - 处理认证token和用户信息的存储
 * 使用顶级域名cookie实现跨子域名共享
 */
class CookieService {
    // 定义共享token的存储键
    static TOKEN_KEY = 'authToken';
    static USER_INFO_KEY = 'userInfo';
    static DOMAIN = '.rg-experience.com'; // 顶级域名，用于共享cookie

    /**
     * 设置cookie
     * @param {string} name cookie名称
     * @param {string} value cookie值
     * @param {Object} options cookie选项
     */
    static setCookie(name, value, options = {}) {
        const defaultOptions = {
            path: '/',
            domain: this.DOMAIN,
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
        console.log(`Cookie set: ${name}=${value.substring(0, 10)}... with options:`, cookieOptions);
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
        console.log(`Cookie not found: ${name}`);
        return null;
    }

    /**
     * 删除cookie
     * @param {string} name cookie名称
     */
    static deleteCookie(name) {
        // 删除cookie最可靠的方法是将其设置为过期
        this.setCookie(name, '', {
            maxAge: -1, // 立即过期
            domain: this.DOMAIN,
            path: '/'
        });
        console.log(`Cookie deleted: ${name}`);
    }

    /**
     * 设置token到cookie
     * @param {string} token JWT token
     */
    static setToken(token) {
        this.setCookie(this.TOKEN_KEY, token);
        return true;
    }

    /**
     * 从cookie获取token
     * @returns {string|null} JWT token或null
     */
    static getToken() {
        return this.getCookie(this.TOKEN_KEY);
    }

    /**
     * 设置用户信息到cookie
     * @param {Object} userInfo 用户信息对象
     */
    static setUserInfo(userInfo) {
        try {
            const userInfoStr = JSON.stringify(userInfo);
            this.setCookie(this.USER_INFO_KEY, userInfoStr);
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
            const userInfoStr = this.getCookie(this.USER_INFO_KEY);
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
        this.deleteCookie(this.TOKEN_KEY);
        this.deleteCookie(this.USER_INFO_KEY);
        return true;
    }

    /**
     * 检查用户是否已登录
     * @returns {boolean} 用户是否已登录
     */
    static isLoggedIn() {
        return !!this.getToken();
    }

    /**
     * 为本地开发环境设置域名
     * @param {string} domain 使用的域名
     */
    static setDomain(domain) {
        this.DOMAIN = domain;
        console.log(`Cookie domain set to: ${domain}`);
    }
}

// 本地开发环境自动配置
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
    CookieService.setDomain('localhost');
}

export default CookieService; 