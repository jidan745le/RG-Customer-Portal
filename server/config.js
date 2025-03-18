// 服务器配置
module.exports = {
  // 服务器监听端口，可以通过环境变量覆盖
  port: process.env.PORT || 3001,
  
  // 环境变量，通常通过NODE_ENV设置
  env: process.env.NODE_ENV || 'production',
  
  // API前缀
  apiPrefix: '/api',
  
  // 静态资源路径
  staticPath:    '../dist' ,
   
    
  // 数据库连接（示例）
  db: {
    url: process.env.DATABASE_URL || 'mongodb://localhost:27017/customer-portal',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  
  // JWT密钥（安全认证用）
  jwtSecret: process.env.JWT_SECRET || 'your-secret-key-change-in-production',
  
  // CORS配置
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
}; 