/**
 * Script cập nhật ảnh cho sản phẩm trong MongoDB
 */
require('./utils/MongooseUtil');
const Models = require('./models/Models');
const https = require('https');
const http = require('http');

const foodImages = {
  // Cơm
  'Cơm trộn Bibimbap': 'https://images.unsplash.com/photo-1553163147-622ab57be1c7?w=400&h=300&fit=crop',
  'Cơm cuộn Kimbap': 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop',
  'Cơm chiên Kimchi': 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=400&h=300&fit=crop',

  // Mì
  'Mì cay Shin Ramyun': 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=300&fit=crop',
  'Mì lạnh Naengmyeon': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=300&fit=crop',
  'Mì đen Jajangmyeon': 'https://images.unsplash.com/photo-1555126634-323283e090fa?w=400&h=300&fit=crop',

  // Lẩu
  'Lẩu kim chi': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop',
  'Lẩu bò Bulgogi': 'https://images.unsplash.com/photo-1583224964978-2257b960c3d3?w=400&h=300&fit=crop',
  'Lẩu quân đội Budae': 'https://images.unsplash.com/photo-1504544750208-dc0358e63f7f?w=400&h=300&fit=crop',

  // Món phụ
  'Gà rán Hàn Quốc': 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400&h=300&fit=crop',
  'Bánh gạo Tteokbokki': 'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=400&h=300&fit=crop',
  'Bánh xèo Hàn Quốc': 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=400&h=300&fit=crop',

  // Đồ uống
  'Trà mật ong Yuzu': 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&h=300&fit=crop',
  'Soju truyền thống': 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400&h=300&fit=crop',
  'Nước gạo Sikhye': 'https://images.unsplash.com/photo-1546173159-315724a31696?w=400&h=300&fit=crop',
};

function downloadImage(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;

    const makeRequest = (requestUrl, redirectCount = 0) => {
      if (redirectCount > 5) {
        reject(new Error('Too many redirects'));
        return;
      }

      client.get(requestUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (response) => {
        if (response.statusCode >= 300 && response.statusCode < 400 && response.headers.location) {
          let redirectUrl = response.headers.location;
          if (redirectUrl.startsWith('//')) redirectUrl = 'https:' + redirectUrl;
          else if (redirectUrl.startsWith('/')) redirectUrl = new URL(requestUrl).origin + redirectUrl;

          const redirectClient = redirectUrl.startsWith('https') ? https : http;
          redirectClient.get(redirectUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
            if (res2.statusCode >= 300 && res2.statusCode < 400 && res2.headers.location) {
              makeRequest(res2.headers.location, redirectCount + 2);
              return;
            }
            const chunks = [];
            res2.on('data', (chunk) => chunks.push(chunk));
            res2.on('end', () => resolve(Buffer.concat(chunks)));
            res2.on('error', reject);
          }).on('error', reject);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`HTTP ${response.statusCode}`));
          return;
        }

        const chunks = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', () => resolve(Buffer.concat(chunks)));
        response.on('error', reject);
      }).on('error', reject);
    };

    makeRequest(url);
  });
}

async function updateProductImages() {
  console.log('⏳ Đang kết nối MongoDB...');
  await new Promise(resolve => setTimeout(resolve, 3000));

  const products = await Models.Product.find({}).exec();
  console.log(`📦 Tìm thấy ${products.length} sản phẩm trong DB`);

  let updated = 0;
  let failed = 0;

  for (const product of products) {
    const imageUrl = foodImages[product.name];
    if (!imageUrl) {
      console.log(`⚠️  Không tìm thấy URL ảnh cho: ${product.name}`);
      failed++;
      continue;
    }

    try {
      console.log(`📥 Đang tải ảnh cho: ${product.name}...`);
      const imageBuffer = await downloadImage(imageUrl);
      const base64Image = imageBuffer.toString('base64');

      await Models.Product.findByIdAndUpdate(product._id, {
        image: base64Image
      });

      console.log(`✅ Đã cập nhật ảnh cho: ${product.name} (${Math.round(base64Image.length / 1024)}KB)`);
      updated++;
    } catch (error) {
      console.log(`❌ Lỗi tải ảnh cho ${product.name}: ${error.message}`);
      failed++;
    }
  }

  console.log(`\\n🎉 Hoàn tất! Cập nhật: ${updated}, Lỗi: ${failed}`);
  process.exit(0);
}

updateProductImages().catch(err => {
  console.error('Lỗi:', err);
  process.exit(1);
});
