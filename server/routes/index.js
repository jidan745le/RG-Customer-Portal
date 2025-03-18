const express = require('express');
const config = require('../config');
const authRoutes = require('./auth');

// 创建API路由器
const router = express.Router();

// 中间件 - 接口请求日志
router.use((req, res, next) => {
  console.log(`API请求: ${req.method} ${req.originalUrl}`);
  next();
});

// 基础状态检查
router.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: config.env
  });
});

// 加载认证路由
router.use('/auth', authRoutes);

// 中间件 - 处理404错误
router.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`
  });
});

// 中间件 - 错误处理
router.use((err, req, res, next) => {
  console.error('API错误:', err);
  
  res.status(err.status || 500).json({
    error: err.name || 'InternalServerError',
    message: err.message || '服务器内部错误',
    stack: config.env === 'development' ? err.stack : undefined
  });
});

module.exports = router; 