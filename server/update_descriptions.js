const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const Models = require('./models/Models');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

async function autoUpdateDescriptions() {
  try {
    await mongoose.connect(uri);
    console.log('Đã kết nối cơ sở dữ liệu để cập nhật mô tả...');

    const products = await Models.Product.find({});
    console.log(`Tìm thấy ${products.length} sản phẩm.`);

    let updatedCount = 0;

    for (const prod of products) {
      if (!prod.description || prod.description.trim() === '') {
        let desc = '';
        const name = prod.name.toLowerCase();

        if (name.includes('bibimbap') || name.includes('cơm trộn')) {
          desc = "Món cơm trộn đặc sản Hàn Quốc với sự kết hợp hài hòa của các loại rau củ, thịt bò, trứng ốp la và nước sốt Gochujang truyền thống, mang lại hương vị đậm đà và đầy đủ dinh dưỡng.";
        } else if (name.includes('kimbap') || name.includes('cơm cuộn')) {
          desc = "Cơm cuộn rong biển tinh tế với nhân đa dạng như xúc xích, trứng, rau chân vịt, cà rốt và củ cải muối, được cuộn chặt tay và cắt thành từng khoanh tròn vừa ăn, rất tiện lợi và bổ dưỡng.";
        } else if (name.includes('tokbokki') || name.includes('tobbokki') || name.includes('bánh gạo')) {
          desc = "Món bánh gạo cay quốc dân của Hàn Quốc với những miếng bánh gạo dẻo thơm quyện trong nước sốt ớt cay nồng, đậm đà, ăn kèm chả cá và trứng luộc, mang lại trải nghiệm ẩm thực đường phố đích thực.";
        } else if (name.includes('gà rán') || name.includes('chicken')) {
          desc = "Gà rán phong cách Hàn Quốc với lớp vỏ ngoài giòn tan, bên trong vẫn giữ được độ mềm ngọt của thịt, được phủ các loại sốt đặc biệt như sốt cay hoặc sốt tỏi mật ong vô cùng hấp dẫn.";
        } else if (name.includes('mì cay') || name.includes('ramen')) {
          desc = "Sợi mì dai giòn kết hợp cùng nước dùng cay nồng đặc trưng, đi kèm topping hải sản, thịt bò và rau tươi mới, mang lại thử thách vị giác đầy thú vị cho những tín đồ ăn cay.";
        } else if (name.includes('lẩu') || name.includes('soup')) {
          desc = "Món lẩu Hàn Quốc với nước dùng thanh ngọt hoặc cay nồng tùy chọn, được nấu từ các nguyên liệu tươi ngon nhất cùng đa dạng các loại topping nhúng lẩu đặc sắc.";
        } else if (name.includes('mì đen') || name.includes('jajangmyeon')) {
          desc = "Mì trộn sốt tương đen truyền thống Hàn Quốc với sợi mì dai, nước sốt sánh mịn từ tương đen lên men, hành tây và thịt bằm, mang lại hương vị thơm ngon khó cưỡng.";
        } else if (name.includes('kimchi') || name.includes('kim chi')) {
          desc = "Món dưa muối truyền thống không thể thiếu trong mỗi bữa ăn Hàn Quốc, được làm từ cải thảo lên men với ớt bột và các gia vị đặc trưng, có vị chua cay hài hòa, kích thích vị giác.";
        } else {
          desc = "Một món ăn trứ danh trong thực đơn của Mukbang Korea Food, được chế biến từ những nguyên liệu tươi ngon nhất bởi các đầu bếp giàu kinh nghiệm, đảm bảo mang đến cho bạn hương vị chuẩn Hàn Quốc và một trải nghiệm ẩm thực khó quên.";
        }

        await Models.Product.findByIdAndUpdate(prod._id, { description: desc });
        updatedCount++;
      }
    }

    console.log(`Hoàn tất! Đã cập nhật mô tả tự động cho ${updatedCount} sản phẩm.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi cập nhật:', err);
    process.exit(1);
  }
}

autoUpdateDescriptions();
