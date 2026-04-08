const express = require('express');
const router = express.Router();

// daos
const CategoryDAO = require('../models/CategoryDAO');
const ProductDAO = require('../models/ProductDAO');
const OrderDAO = require('../models/OrderDAO');

// category
router.get('/categories', async function (req, res) {
  const categories = await CategoryDAO.selectAll();
  res.json(categories);
});

// product
router.get('/products', async function (req, res) {
  const products = await ProductDAO.selectAll();
  res.json(products);
});
router.get('/products/new', async function (req, res) {
  const products = await ProductDAO.selectTopNew(3);
  res.json(products);
});

// utils
const CryptoUtil = require('../utils/CryptoUtil');
const EmailUtil = require('../utils/EmailUtil');

// daos
const CustomerDAO = require('../models/CustomerDAO');

// utils
const JwtUtil = require('../utils/JwtUtil');

// customer
// === OTP Storage (in-memory) ===
const otpStore = {}; // { email: { otp, data, expires } }

// customer - Step 1: Send OTP
router.post('/signup', async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address;

  const dbCust = await CustomerDAO.selectByUsernameOrEmail(username, email);

  if (dbCust) {
    res.json({ success: false, message: 'Tài khoản hoặc email đã tồn tại!' });
  } else {
    // Generate 6-digit OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    
    // Store OTP with expiration (5 minutes)
    otpStore[email] = {
      otp: otp,
      data: { username, password, name, phone, email, address },
      expires: Date.now() + 5 * 60 * 1000
    };

    // Send OTP via email
    const sendmail = await EmailUtil.send(
      email,
      'Mã xác thực OTP - Mukbang Korea Food',
      `Xin chào ${name},\n\nMã OTP xác thực tài khoản của bạn là: ${otp}\n\nMã có hiệu lực trong 5 phút.\nVui lòng không chia sẻ mã này với bất kỳ ai.\n\n— Mukbang Korea Food`
    );

    if (sendmail) {
      res.json({ success: true, message: 'Mã OTP đã được gửi đến email của bạn!', requireOtp: true });
    } else {
      res.json({ success: false, message: 'Gửi email thất bại. Vui lòng thử lại!' });
    }
  }
});

// customer - Step 2: Verify OTP and create account
router.post('/verify-otp', async function (req, res) {
  const email = req.body.email;
  const otp = req.body.otp;

  const stored = otpStore[email];

  if (!stored) {
    return res.json({ success: false, message: 'Không tìm thấy mã OTP. Vui lòng đăng ký lại!' });
  }

  if (Date.now() > stored.expires) {
    delete otpStore[email];
    return res.json({ success: false, message: 'Mã OTP đã hết hạn. Vui lòng đăng ký lại!' });
  }

  if (stored.otp !== otp) {
    return res.json({ success: false, message: 'Mã OTP không đúng!' });
  }

  // OTP valid — create customer account
  const { username, password, name, phone, address } = stored.data;
  const now = new Date().getTime();
  const token = CryptoUtil.md5(now.toString());

  const newCust = {
    username, password, name, phone, email, address,
    token: token,
    active: 1 // Active immediately since OTP verified
  };

  const result = await CustomerDAO.insert(newCust);
  delete otpStore[email]; // Clean up

  if (result) {
    res.json({ success: true, message: 'Đăng ký thành công! Bạn có thể đăng nhập ngay.' });
  } else {
    res.json({ success: false, message: 'Tạo tài khoản thất bại!' });
  }
});

// customer - forgot password
router.post('/forgot-password', async function (req, res) {
  const email = req.body.email;
  
  // Find customer by email (or username, using existing method)
  const customer = await CustomerDAO.selectByUsernameOrEmail(email, email);

  if (!customer) {
    return res.json({ success: false, message: 'Email không tồn tại trong hệ thống!' });
  }

  // Generate a new 6-digit random password
  const newPassword = 'MK' + Math.floor(1000 + Math.random() * 9000);
  customer.password = newPassword;
  
  const result = await CustomerDAO.update(customer);

  if (result) {
    const sendmail = await EmailUtil.send(
      email,
      'Khôi phục mật khẩu - Mukbang Korea Food',
      `Xin chào ${customer.name},\n\nMật khẩu mới của bạn là: ${newPassword}\n\nVui lòng đăng nhập bằng mật khẩu này và đổi lại mật khẩu trong Hồ sơ của bạn.\n\n— Mukbang Korea Food`
    );

    if (sendmail) {
      res.json({ success: true, message: 'Mật khẩu mới đã được gửi đến email của bạn! Vui lòng kiểm tra hộp thư.' });
    } else {
      res.json({ success: false, message: 'Lỗi khi gửi email. Vui lòng thử lại sau!' });
    }
  } else {
    res.json({ success: false, message: 'Cập nhật mật khẩu thất bại!' });
  }
});

// customer
router.post('/active', async function (req, res) {
  const _id = req.body.id;
  const token = req.body.token;
  const result = await CustomerDAO.active(_id, token, 1);
  res.json(result);
});

router.get('/products/hot', async function (req, res) {
  const products = await ProductDAO.selectTopHot(3);
  res.json(products);
});
router.get('/products/category/:cid', async function (req, res) {
  const _cid = req.params.cid;
  const products = await ProductDAO.selectByCatID(_cid);
  res.json(products);
});
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
router.get('/products/search/:keyword', async function (req, res) {
  const keyword = req.params.keyword;
  const products = await ProductDAO.selectByKeyword(keyword);
  res.json(products);
});
router.get('/products/:id', async function (req, res) {
  const _id = req.params.id;
  const product = await ProductDAO.selectByID(_id);
  res.json(product);
});
router.post("/login", async function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    const customer = await CustomerDAO.selectByUsernameAndPassword(
      username,
      password,
    );

    if (customer) {
      if (customer.active === 1) {
        const token = JwtUtil.genToken();

        res.json({
          success: true,
          message: "Authentication successful",
          token: token,
          customer: customer,
        });
      } else {
        res.json({ success: false, message: "Account is deactive" });
      }
    } else {
      res.json({ success: false, message: "Incorrect username or password" });
    }
  } else {
    res.json({ success: false, message: "Please input username and password" });
  }
});

router.get("/token", JwtUtil.checkToken, function (req, res) {
  const token = req.headers["x-access-token"] || req.headers["authorization"];

  res.json({
    success: true,
    message: "Token is valid",
    token: token,
  });
});

// myprofile
router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {

  const _id = req.params.id;

  const username = req.body.username;
  const password = req.body.password;
  const name = req.body.name;
  const phone = req.body.phone;
  const email = req.body.email;
  const address = req.body.address;

  const customer = {
    _id: _id,
    username: username,
    password: password,
    name: name,
    phone: phone,
    email: email,
    address: address
  };

  const result = await CustomerDAO.update(customer);

  res.json(result);

});

// mycart
router.post('/checkout', JwtUtil.checkToken, async function (req, res) {

  const now = new Date().getTime(); // milliseconds
  const total = req.body.total;
  const items = req.body.items;
  const customer = req.body.customer;

  const order = {
    cdate: now,
    total: total,
    status: 'PENDING',
    customer: customer,
    items: items
  };

  const result = await OrderDAO.insert(order);

  res.json(result);
});

// myorders
router.get('/orders/customer/:cid', JwtUtil.checkToken, async function (req, res) {
  const _cid = req.params.cid;
  const orders = await OrderDAO.selectByCustID(_cid);
  res.json(orders);
});

module.exports = router;