# RG Customer Portal 服务器

这是RG Customer Portal应用的Node.js服务器部分，用于提供API接口和静态资源服务。

## 功能特点

- 提供React应用构建后的静态文件
- 支持SPA单页应用路由
- 提供REST API接口
- JWT认证系统
- 开发和生产环境配置
- 错误处理和日志记录

## 目录结构

```
server/
├── config.js             # 服务器配置
├── index.js              # 主服务器文件（生产环境）
├── dev-server.js         # 开发服务器文件（支持HMR）
├── middleware/           # 中间件
│   ├── auth.js           # 认证中间件
│   └── errorHandler.js   # 错误处理中间件
└── routes/               # API路由
    ├── index.js          # 路由加载器
    └── auth.js           # 认证相关路由
```

## 如何运行

### 安装依赖

```bash
npm install
```

### 开发模式

同时运行React前端和API服务器，支持热模块替换(HMR)：

```bash
npm run dev
```

### 生产模式

构建React应用并启动生产服务器：

```bash
npm run prod
```

仅启动服务器（假设已构建）：

```bash
npm run server
```

## API接口

### 认证API

- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册
- GET `/api/auth/me` - 获取当前用户信息

### 健康检查

- GET `/api/health` - 服务器状态检查

## 环境变量

服务器可以通过环境变量进行配置：

- `PORT` - 服务器端口（默认：3000）
- `NODE_ENV` - 环境（development/production，默认：development）
- `JWT_SECRET` - JWT签名密钥
- `DATABASE_URL` - 数据库连接URL（目前为模拟数据）
- `CORS_ORIGIN` - CORS允许的源（默认：*）

## 安全注意事项

- 生产环境中必须更改JWT密钥
- 密码应该在数据库中加密存储（目前为演示使用明文）
- 在生产环境中应实现速率限制以防止暴力攻击

## 扩展建议

- 添加数据库连接（MongoDB、MySQL等）
- 实现刷新令牌机制
- 添加用户密码重置功能
- 实现更完善的日志系统 