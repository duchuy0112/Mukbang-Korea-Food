const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const express = require('express');
const app = express();

// Bắt lỗi toàn cục để tránh server bị crash trên Render
process.on('uncaughtException', (err) => {
  console.error("Uncaught Exception:", err);
});
process.on('unhandledRejection', (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// 1. Kết nối MongoDB
require('./utils/MongooseUtil');

// 2. Middlewares
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// 3. APIs
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from server!' });
});

// Huy nhớ kiểm tra file admin.js và customer.js có export đúng router không nhé
app.use('/api/admin', require('./api/admin.js'));
app.use('/api/customer', require('./api/customer.js'));

// Thêm health check cho Render proxy kiểm tra trạng thái server
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// 4. Deployment (Phục vụ file static từ thư mục Build đã copy vào Server)
app.use('/admin', express.static(path.resolve(__dirname, 'admin-build')));
app.get('/admin/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'admin-build', 'index.html'));
});

app.use('/', express.static(path.resolve(__dirname, 'customer-build')));
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'customer-build', 'index.html'));
});


// 5. Khởi chạy Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server đang lắng nghe tại port: ${PORT}`);
});