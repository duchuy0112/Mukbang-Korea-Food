const dns = require('dns');
// Chỉ thiết lập lại DNS trên môi trường Windows (Local dev) để tránh lỗi mạng nội bộ trên Render
if (process.platform === 'win32') {
  dns.setServers(['1.1.1.1', '1.0.0.1']);
}

const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri =
  'mongodb+srv://' +
  MyConstants.DB_USER +
  ':' +
  MyConstants.DB_PASS +
  '@' +
  MyConstants.DB_SERVER +
  '/' +
  MyConstants.DB_DATABASE;

mongoose
  .connect(uri)
  .then(() => {
    console.log(
      'Connected to ' +
      MyConstants.DB_SERVER +
      '/' +
      MyConstants.DB_DATABASE
    );
  })
  .catch((err) => {
    console.error(err);
  });
