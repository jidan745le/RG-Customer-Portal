const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('../config');

// 模拟用户数据库
const users = [
  {
    id: 1,
    username: 'admin',
    password: 'admin123',
    name: '管理员',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    name: '普通用户',
    role: 'user'
  }
];

// 登录接口
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // 找到匹配的用户
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: '用户名或密码不正确' });
  }
  
  // 生成JWT令牌
  const token = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
  
  // 返回用户信息（不包含密码）和令牌
  const { password: _, ...userWithoutPassword } = user;
  
  res.json({
    user: userWithoutPassword,
    token,
    expiresIn: 86400 // 24小时，单位为秒
  });
});

// 注册接口
router.post('/register', (req, res) => {
  const { username, password, name } = req.body;
  
  // 检查用户名是否已存在
  if (users.some(u => u.username === username)) {
    return res.status(409).json({ message: '用户名已存在' });
  }
  
  // 创建新用户
  const newUser = {
    id: users.length + 1,
    username,
    password,
    name: name || username,
    role: 'user'
  };
  
  // 添加到用户数组（在实际应用中应该保存到数据库）
  users.push(newUser);
  
  // 生成JWT令牌
  const token = jwt.sign(
    { id: newUser.id, username: newUser.username, role: newUser.role },
    config.jwtSecret,
    { expiresIn: '24h' }
  );
  
  // 返回新用户信息（不包含密码）和令牌
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    user: userWithoutPassword,
    token,
    expiresIn: 86400 // 24小时，单位为秒
  });
});

// 获取当前用户信息
router.get('/me', (req, res) => {
  // 从请求头获取令牌
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: '未提供认证令牌' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // 验证令牌
    const decoded = jwt.verify(token, config.jwtSecret);
    
    // 查找用户
    const user = users.find(u => u.id === decoded.id);
    
    if (!user) {
      return res.status(404).json({ message: '用户不存在' });
    }
    
    // 返回用户信息（不包含密码）
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    res.status(401).json({ message: '无效的认证令牌' });
  }
});

module.exports = router; 