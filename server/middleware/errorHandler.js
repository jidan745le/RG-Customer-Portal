const config = require('../config');

/**
 * 404错误处理中间件
 * 处理找不到的路由
 */
const notFoundHandler = (req, res, next) => {
  const error = new Error(`找不到路由: ${req.method} ${req.originalUrl}`);
  error.status = 404;
  error.name = 'NotFoundError';
  next(error);
};

/**
 * 全局错误处理中间件
 * 处理应用中的所有错误
 */
const errorHandler = (err, req, res, next) => {
  const statusCode = err.status || 500;
  const errorName = err.name || 'InternalServerError';
  const errorMessage = err.message || '服务器内部错误';
  
  // 记录错误
  console.error(`[错误] ${statusCode} - ${errorName}: ${errorMessage}`);
  if (err.stack && config.env === 'development') {
    console.error(err.stack);
  }
  
  // 发送响应
  res.status(statusCode).json({
    error: errorName,
    message: errorMessage,
    // 仅在开发环境中包含堆栈信息
    stack: config.env === 'development' ? err.stack : undefined
  });
};

module.exports = {
  notFoundHandler,
  errorHandler
}; 