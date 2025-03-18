const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const config = require('../webpack.config.js');
const morgan = require('morgan');

// 为开发环境添加HMR入口点
config.entry = [
  'webpack-hot-middleware/client?reload=true',
  config.entry
];

// 添加HMR插件
config.plugins.push(new webpack.HotModuleReplacementPlugin());

const compiler = webpack(config);
const app = express();
const PORT = process.env.PORT || 3000;

// 日志记录
app.use(morgan('dev'));

// 使用webpack-dev-middleware
app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  stats: { colors: true },
}));

// 使用webpack-hot-middleware
app.use(webpackHotMiddleware(compiler));

// 提供静态文件
app.use(express.static(path.join(__dirname, '../public')));

// API路由示例
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString(), env: 'development' });
});

// 所有未匹配的GET请求将返回index.html，以支持SPA客户端路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`开发服务器运行在端口 ${PORT}`);
  console.log(`访问地址: http://localhost:${PORT}`);
}); 