const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const Models = require('./models/Models');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

async function autoUpdateIngredients() {
  try {
    await mongoose.connect(uri);
    console.log('Đã kết nối cơ sở dữ liệu để cập nhật thành phần...');

    const products = await Models.Product.find({});
    console.log(`Tìm thấy ${products.length} sản phẩm.`);

    let updatedCount = 0;

    for (const prod of products) {
      if (!prod.ingredients || prod.ingredients.trim() === '') {
        let ingredients = '';
        const name = prod.name.toLowerCase();

        if (name.includes('bibimbap') || name.includes('cơm trộn')) {
          ingredients = "Gạo dẻo, thịt bò thăn, trứng gà, nấm hương, giá đỗ, cà rốt, bí ngòi, cải bó xôi, tương ớt Gochujang, dầu mè.";
        } else if (name.includes('kimbap') || name.includes('cơm cuộn')) {
          ingredients = "Cơm trắng, rong biển khô, xúc xích, trứng chiên, cà rốt, dưa chuột, củ cải muối vàng, rau chân vịt, dầu mè.";
        } else if (name.includes('tokbokki') || name.includes('tobbokki') || name.includes('bánh gạo')) {
          ingredients = "Bánh gạo (Garaetteok), chả cá (Eomuk), trứng luộc, hành tây, bắp cải, hành lá, sốt ớt cay truyền thống.";
        } else if (name.includes('gà rán') || name.includes('chicken')) {
          ingredients = "Thịt đùi gà tươi, bột chiên giòn đặc biệt, tỏi, gừng, gia vị Hàn Quốc, sốt cay hoặc sốt mật ong.";
        } else if (name.includes('mì cay') || name.includes('ramen')) {
          ingredients = "Sợi mì ramen dai, thịt bò, tôm tươi, mực, bắp cải, nấm kim châm, hành tây, sốt mì cay 7 cấp độ.";
        } else if (name.includes('lẩu') || name.includes('soup')) {
          ingredients = "Nước dùng xương hầm 12 giờ, các loại rau nhúng (cải thảo, tần ô), nấm, thịt bò bắp, hải sản tươi, đậu hũ.";
        } else if (name.includes('mì đen') || name.includes('jajangmyeon')) {
          ingredients = "Mì sợi to, sốt tương đen (Chunjang), thịt heo nạc bằm, khoai tây, hành tây, bí ngòi, dưa chuột trang trí.";
        } else if (name.includes('kimchi') || name.includes('kim chi')) {
          ingredients = "Cải thảo, bột ớt Hàn Quốc (Gochugaru), tỏi, gừng, mắm tép, nước mắm, hành lá, hẹ, cà rốt, đường.";
        } else {
          ingredients = "Nguyên liệu tươi sạch chọn lọc trong ngày, gia vị truyền thống nhập khẩu trực tiếp từ Hàn Quốc, đảm bảo hương vị độc bản.";
        }

        await Models.Product.findByIdAndUpdate(prod._id, { ingredients: ingredients });
        updatedCount++;
      }
    }

    console.log(`Hoàn tất! Đã cập nhật thành phần tự động cho ${updatedCount} sản phẩm.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi cập nhật thành phần:', err);
    process.exit(1);
  }
}

autoUpdateIngredients();
