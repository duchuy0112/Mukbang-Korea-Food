const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');
const crypto = require('crypto');
const MyConstants = require('./utils/MyConstants');

// MD5 hash function (same as CryptoUtil)
function md5(input) {
  return crypto.createHash('md5').update(input).digest('hex');
}

const uri =
  'mongodb+srv://' +
  MyConstants.DB_USER +
  ':' +
  MyConstants.DB_PASS +
  '@' +
  MyConstants.DB_SERVER +
  '/' +
  MyConstants.DB_DATABASE;

console.log('Connecting to:', uri);

mongoose
  .connect(uri)
  .then(async () => {
    console.log('✅ Connected to MongoDB!\n');
    await seedData();
    console.log('\n🎉 All data seeded successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Connection error:', err.message);
    process.exit(1);
  });

async function seedData() {
  const Models = require('./models/Models');

  // ==================== 1. ADMIN ====================
  console.log('--- Seeding ADMINS ---');
  const adminCount = await Models.Admin.countDocuments();
  if (adminCount === 0) {
    const admin = await Models.Admin.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'admin',
      password: md5('admin') // password: "admin" -> MD5 hash
    });
    console.log(`  ✅ Created admin: username="admin", password="admin"`);
  } else {
    console.log(`  ⏭️  Admins already exist (${adminCount}), skipping...`);
  }

  // ==================== 2. CATEGORIES ====================
  console.log('--- Seeding CATEGORIES ---');
  const catCount = await Models.Category.countDocuments();
  if (catCount === 0) {
    const categories = [
      { _id: new mongoose.Types.ObjectId(), name: 'Cơm' },
      { _id: new mongoose.Types.ObjectId(), name: 'Mì' },
      { _id: new mongoose.Types.ObjectId(), name: 'Lẩu' },
      { _id: new mongoose.Types.ObjectId(), name: 'Món phụ' },
      { _id: new mongoose.Types.ObjectId(), name: 'Đồ uống' },
    ];
    await Models.Category.insertMany(categories);
    console.log(`  ✅ Created ${categories.length} categories: ${categories.map(c => c.name).join(', ')}`);
  } else {
    console.log(`  ⏭️  Categories already exist (${catCount}), skipping...`);
  }

  // ==================== 3. PRODUCTS ====================
  console.log('--- Seeding PRODUCTS ---');
  const prodCount = await Models.Product.countDocuments();
  if (prodCount === 0) {
    // Get categories to embed in products
    const cats = await Models.Category.find({});
    const catMap = {};
    cats.forEach(c => {
      catMap[c.name] = { _id: c._id, name: c.name };
    });

    const now = new Date().getTime();
    const products = [
      // Cơm
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Cơm trộn Bibimbap',
        price: 85000,
        image: '',
        cdate: now - 1000,
        category: catMap['Cơm']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Cơm cuộn Kimbap',
        price: 65000,
        image: '',
        cdate: now - 2000,
        category: catMap['Cơm']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Cơm chiên Kimchi',
        price: 75000,
        image: '',
        cdate: now - 3000,
        category: catMap['Cơm']
      },
      // Mì
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mì cay Shin Ramyun',
        price: 55000,
        image: '',
        cdate: now - 4000,
        category: catMap['Mì']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mì lạnh Naengmyeon',
        price: 70000,
        image: '',
        cdate: now - 5000,
        category: catMap['Mì']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Mì đen Jajangmyeon',
        price: 80000,
        image: '',
        cdate: now - 6000,
        category: catMap['Mì']
      },
      // Lẩu
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Lẩu kim chi',
        price: 150000,
        image: '',
        cdate: now - 7000,
        category: catMap['Lẩu']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Lẩu bò Bulgogi',
        price: 180000,
        image: '',
        cdate: now - 8000,
        category: catMap['Lẩu']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Lẩu quân đội Budae',
        price: 160000,
        image: '',
        cdate: now - 9000,
        category: catMap['Lẩu']
      },
      // Món phụ
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Gà rán Hàn Quốc',
        price: 95000,
        image: '',
        cdate: now - 10000,
        category: catMap['Món phụ']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Bánh gạo Tteokbokki',
        price: 50000,
        image: '',
        cdate: now - 11000,
        category: catMap['Món phụ']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Bánh xèo Hàn Quốc',
        price: 60000,
        image: '',
        cdate: now - 12000,
        category: catMap['Món phụ']
      },
      // Đồ uống
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Trà mật ong Yuzu',
        price: 35000,
        image: '',
        cdate: now - 13000,
        category: catMap['Đồ uống']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Soju truyền thống',
        price: 45000,
        image: '',
        cdate: now - 14000,
        category: catMap['Đồ uống']
      },
      {
        _id: new mongoose.Types.ObjectId(),
        name: 'Nước gạo Sikhye',
        price: 30000,
        image: '',
        cdate: now - 15000,
        category: catMap['Đồ uống']
      },
    ];

    await Models.Product.insertMany(products);
    console.log(`  ✅ Created ${products.length} products`);
    products.forEach(p => {
      console.log(`     - ${p.name} (${p.price.toLocaleString()}đ) [${p.category.name}]`);
    });
  } else {
    console.log(`  ⏭️  Products already exist (${prodCount}), skipping...`);
  }

  // ==================== 4. CUSTOMER ====================
  console.log('--- Seeding CUSTOMERS ---');
  const custCount = await Models.Customer.countDocuments();
  if (custCount === 0) {
    const token = md5(new Date().getTime().toString());
    const customer = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'customer1',
      password: md5('123456'), // password: "123456"
      name: 'Nguyễn Văn A',
      phone: '0901234567',
      email: 'customer1@gmail.com',
      active: 1,
      token: token
    });
    console.log(`  ✅ Created customer: username="customer1", password="123456"`);
  } else {
    console.log(`  ⏭️  Customers already exist (${custCount}), skipping...`);
  }

  // ==================== 5. ORDERS (Sample) ====================
  console.log('--- Seeding ORDERS ---');
  const orderCount = await Models.Order.countDocuments();
  if (orderCount === 0) {
    const customer = await Models.Customer.findOne({});
    const products = await Models.Product.find({}).limit(3);

    if (customer && products.length >= 3) {
      const order = await Models.Order.create({
        _id: new mongoose.Types.ObjectId(),
        cdate: new Date().getTime(),
        total: products[0].price * 2 + products[1].price * 1,
        status: 'APPROVED',
        customer: {
          _id: customer._id,
          username: customer.username,
          password: customer.password,
          name: customer.name,
          phone: customer.phone,
          email: customer.email,
          active: customer.active,
          token: customer.token
        },
        items: [
          { product: products[0].toObject(), quantity: 2 },
          { product: products[1].toObject(), quantity: 1 },
        ]
      });
      console.log(`  ✅ Created 1 sample order (APPROVED, total: ${order.total.toLocaleString()}đ)`);
    }
  } else {
    console.log(`  ⏭️  Orders already exist (${orderCount}), skipping...`);
  }

  // ==================== SUMMARY ====================
  console.log('\n📊 Database Summary:');
  console.log(`  Admins:     ${await Models.Admin.countDocuments()}`);
  console.log(`  Categories: ${await Models.Category.countDocuments()}`);
  console.log(`  Products:   ${await Models.Product.countDocuments()}`);
  console.log(`  Customers:  ${await Models.Customer.countDocuments()}`);
  console.log(`  Orders:     ${await Models.Order.countDocuments()}`);
}
