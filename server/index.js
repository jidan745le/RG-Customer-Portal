const express = require('express');
const path = require('path');
const compression = require('compression');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const bodyParser = require('body-parser');
const config = require('./config');
const apiRoutes = require('./routes');
const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');

// 创建Express应用
const app = express();
const PORT = config.port;

// 基本中间件
app.use(helmet({
  contentSecurityPolicy: false // 根据需要调整
}));
app.use(compression()); // gzip压缩
app.use(morgan(config.env === 'production' ? 'combined' : 'dev')); // 日志
app.use(cors(config.cors)); // CORS

// 解析请求体
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API路由
app.use(config.apiPrefix, apiRoutes);

// 静态文件服务
const staticPath = path.join(__dirname, config.staticPath);
app.use(express.static(staticPath));

// 客户端路由 - 所有未匹配的GET请求返回index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(staticPath, 'index.html'));
});

// 错误处理中间件
app.use(notFoundHandler);
app.use(errorHandler);

// 启动服务器
app.listen(PORT, () => {
  console.log(`
============================================
  服务器已启动!
  环境: ${config.env}
  端口: ${PORT}
  访问地址: http://localhost:${PORT}
  API前缀: ${config.apiPrefix}
============================================
  `);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  // 在生产环境中，可能需要重新启动服务或通知管理员
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
});

module.exports = app; // 导出用于测试 