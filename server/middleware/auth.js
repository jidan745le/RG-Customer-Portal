const jwt = require('jsonwebtoken');
const config = require('../config');

/**
 * 身份验证中间件
 * 验证请求头中的JWT令牌
 */
const authenticate = (req, res, next) => {
  // 从请求头获取令牌
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: '请提供有效的认证令牌'
    });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // 验证令牌
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // 将用户信息添加到请求对象
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: '无效的认证令牌'
    });
  }
};

/**
 * 角色授权中间件
 * 检查用户是否具有所需角色
 * @param {string[]} roles - 允许访问的角色数组
 */
const authorize = (roles = []) => {
  if (typeof roles === 'string') {
    roles = [roles];
  }
  
  return (req, res, next) => {
    // 确保用户已通过身份验证
    if (!req.user) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: '请先登录'
      });
    }
    
    // 检查用户角色
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({
        error: 'Forbidden',
        message: '您没有权限访问此资源'
      });
    }
    
    next();
  };
};

module.exports = {
  authenticate,
  authorize
}; 