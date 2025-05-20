# Token 共享实现文档 - Cookie 方案

本文档介绍了在 customerhub 和 einvoice 两个前端项目之间实现 token 共享的 Cookie 方案。

## 解决方案概述

通过在顶级域名（`.rg-experience.com`）下设置 Cookie 实现两个不同子域名项目之间的认证信息共享，主要用于共享认证 token 和用户信息。与 localStorage 不同，Cookie 可以在配置正确的情况下在所有子域名之间共享。

### 主要文件

1. `src/utils/cookieService.js` - Cookie 服务，用于管理共享 cookie
2. `src/utils/apiClient.js` - API 客户端，使用 CookieService 获取 token
3. `src/context/AuthContext.js` - 认证上下文，使用 CookieService 管理认证状态
4. `src/pages/Login.js` - 登录页面示例

## 工作原理

1. Cookie 共享原理：当我们设置 cookie 时，指定 `domain` 为 `.rg-experience.com`（注意前面的点），这样该 cookie 将在所有子域名（如 `customerhub.rg-experience.com` 和 `einvoice.rg-experience.com`）之间共享。

2. cookie 设置包含以下关键属性：
   - `domain`: `.rg-experience.com` - 指定 cookie 可用的域名范围
   - `path`: '/' - 使 cookie 在整个域名下可用
   - `secure`: true - 在生产环境中只通过 HTTPS 传输 cookie
   - `sameSite`: 'Lax' - 允许同站请求携带 cookie

## 安装步骤

### 1. 安装依赖
确保项目中安装了必要的依赖：
```bash
npm install axios react-router-dom antd
```

### 2. 复制工具类文件
将以下文件复制到两个项目中的相同位置：
```
src/utils/cookieService.js
```

### 3. 更新 API 客户端
更新 API 客户端，使用 CookieService 获取 token：
```javascript
// 在 apiClient.js 中添加
import CookieService from './cookieService';

// 创建 axios 实例时启用 withCredentials
const apiClient = axios.create({
  // ...其他配置
  withCredentials: true
});

// 在请求拦截器中使用 CookieService
apiClient.interceptors.request.use(
  (config) => {
    const token = CookieService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }
);
```

### 4. 更新认证上下文
更新认证上下文，使用 CookieService 管理认证状态：
```javascript
// 在 AuthContext.js 中
import CookieService from '../utils/cookieService';

// 使用 CookieService 获取和存储 token
```

## 配置说明

### cookieService.js 配置
默认情况下，CookieService 使用 `.rg-experience.com` 作为共享域名。需要根据实际环境进行配置：

1. 生产环境：使用 `.rg-experience.com` 作为 domain
2. 开发环境：使用 `localhost` 或实际开发域名

```javascript
// 在 CookieService 类中
static DOMAIN = '.rg-experience.com'; // 生产环境配置

// 本地开发环境自动配置
if (process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost') {
  CookieService.setDomain('localhost');
}
```

### 后端配置要求
对于跨域请求，后端 API 需要配置正确的 CORS 头，允许前端携带凭证：

```javascript
// Node.js Express 示例
app.use(cors({
  origin: true, // 或指定允许的域名
  credentials: true // 关键：允许跨域请求携带凭证
}));
```

## 使用示例

### 登录时保存 token
```javascript
import CookieService from '../utils/cookieService';

async function handleLogin(response) {
  const { token, user } = response.data;
  
  // 保存 token 和用户信息到共享 Cookie
  CookieService.setToken(token);
  CookieService.setUserInfo(user);
}
```

### 获取 token 用于 API 请求
```javascript
import CookieService from '../utils/cookieService';

function getAuthHeader() {
  const token = CookieService.getToken();
  
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}
```

### 登出时清除 token
```javascript
import CookieService from '../utils/cookieService';

function handleLogout() {
  CookieService.logout();
  // 继续处理登出后的逻辑
}
```

## 安全注意事项

1. **HTTPS 使用**: 在生产环境中，必须使用 HTTPS 以确保 cookie 的安全传输。
2. **设置 `secure` 标志**: 确保在生产环境中设置 cookie 的 `secure` 标志。
3. **适当的 `SameSite` 设置**: 默认使用 'Lax'，根据需要可以调整为更严格的设置。
4. **最小敏感信息**: 尽量减少存储在 cookie 中的敏感信息，仅保存必要的认证数据。

## 常见问题排查

### Cookie 未在子域名间共享
1. 确认 cookie 设置中 `domain` 值前有点，如 `.rg-experience.com`
2. 检查是否正确设置了 `path` 为 '/'
3. 使用浏览器开发工具检查 cookie 是否正确创建和存储

### 跨域请求未携带 Cookie
1. 确保 axios 实例设置了 `withCredentials: true`
2. 确保后端 CORS 配置中设置了 `credentials: true`
3. 检查 `SameSite` 设置是否适合你的用例

### 本地开发不工作
本地开发时，cookie 共享较为复杂，建议：
1. 使用 `localhost` 作为开发域名
2. 或设置自定义本地域名（如通过修改 hosts 文件）模拟生产环境 