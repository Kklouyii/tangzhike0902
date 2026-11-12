// 数据服务器:提供 /api/poems 接口,返回 db.json 里的 poems 数组
// 启动方式:在 db 文件夹里执行 node server.js,端口 3004
const express = require('express');
const fs = require('fs');
const path = require('path');

const wy_port = 3004;
const app = express();

// 允许跨域:poems.html 用 file:// 直接打开也能请求到数据
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 服务器只在启动时读一次文件:改了 db.json 要 Ctrl+C 停掉再 node server.js 重启才能看到变化
const data = JSON.parse(fs.readFileSync(path.join(__dirname, 'db.json'), 'utf8'));

app.get('/api/poems', (req, res) => {
  res.json(data);
});

app.listen(wy_port, () => {
  console.log(`数据服务器已启动: http://localhost:${wy_port}/api/poems`);
});
