const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const Models = require('./models/Models');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

const productData = {
  "Mì lạnh Naengmyeon": {
    desc: "Mì làm từ bột kiều mạch hòa quyện trong nước dùng thanh mát từ xương bò hầm kỳ công, được ướp lạnh tỉ mỉ cùng lê, dưa chuột và trứng luộc. Một lựa chọn hoàn hảo để xua tan cái nóng và tận hưởng tinh hoa ẩm thực Seoul.",
    ingred: "Sợi mì kiều mạch dai ngon, nước dùng bò hầm theo công thức bí truyền, lát thịt bò thăn, trứng luộc, lát lê tươi, dưa chuột, củ cải trắng muối chua."
  },
  "Bánh xèo Hàn Quốc": {
    desc: "Bánh xèo giòn tan với nhân hành lá tươi non và hải sản phong phú, mang đến hương vị bùi ngậy và mùi thơm đặc trưng không thể trộn lẫn của ẩm thực đường phố Hàn Quốc.",
    ingred: "Bột bánh xèo chuyên dụng, hành lá tươi (Pajeon), tôm tươi, mực xắt nhỏ, trứng gà, gia vị đặc trưng, nước chấm tương cay."
  },
  "Trà mật ong Yuzu": {
    desc: "Trà thanh nhiệt với hương thơm nồng nàn từ quả thanh trà Yuzu hòa quyện cùng mật ong rừng tinh túy. Cung cấp vitamin C dồi dào và mang lại cảm giác sảng khoái tức thì.",
    ingred: "Quả thanh trà Yuzu mật ong (Hàn Quốc), nước lọc, đá sạch, lát chanh trang trí, lá bạc hà."
  },
  "Cơm trộn Bibimbap": {
    desc: "Sự kết hợp hoàn mỹ của cơm trắng dẻo thơm, các loại rau củ tươi xanh, thịt bò thăn và nước sốt Gochujang đặc trưng. Một bữa ăn đầy đủ dinh dưỡng với màu sắc bắt mắt và hương vị đậm đà.",
    ingred: "Gạo dẻo, thịt bò thăn xay, trứng gà (lòng đào), nấm hương, giá đỗ, cà rốt, bí ngòi, rau chân vịt, tương ớt Gochujang Hàn Quốc, dầu mè."
  },
  "Lẩu bò Bulgogi": {
    desc: "Món lẩu đặc trưng với nước dùng thanh ngọt nấu từ nấm và rau củ, điểm xuyết những lát thịt bò Mỹ cao cấp được ướp sốt Bulgogi mềm thơm khó cưỡng.",
    ingred: "Thịt bò Mỹ cao cấp, sốt Bulgogi, nấm kim châm, nấm hương, miến Hàn Quốc, hành tây, cà rốt, bắp cải, nước dùng xương hầm đặc biệt."
  },
  "Gà rán Hàn Quốc": {
    desc: "Gà rán với lớp vỏ ngoài giòn tan độc bản, thịt bên trong mềm ngọt mọng nước, được phủ lớp sốt cay nồng nàn hoặc sốt tỏi mật ong óng ánh theo lựa chọn của bạn.",
    ingred: "Thịt đùi gà tươi, bột chiên giòn chuyên dùng, tỏi, gừng, gia vị Seoul, sốt Gochujang cay hoặc sốt mật ong tỏi bùi ngậy."
  },
  "Mì cay Shin Ramyun": {
    desc: "Dòng mì cay trứ danh Hàn Quốc với nước dùng đỏ nồng vị ớt bột Gochugaru, sợi mì dai giòn kết hợp cùng hải sản và thịt bò tươi ngon.",
    ingred: "Sợi mì Shin Ramen, gói gia vị đặc trưng, tôm, mực, bò Mỹ, nấm kim châm, bắp cải, hành hành lá, trứng gà."
  },
  "Lẩu kim chi": {
    desc: "Vị chua cay nồng nàn từ Kimchi cải thảo lâu năm hòa quyện cùng nước dùng xương hầm, đậu hũ trắng mềm mịn và thịt heo nạc mang lại hương vị truyền thống tinh tế.",
    ingred: "Kimchi cải thảo đặc biệt, thịt ba chỉ heo, đậu hũ trắng, nấm hương, hành tây, hành lá, ớt tươi, nước dùng xương hầm nóng hổi."
  },
  "Lẩu quân đội Budae": {
    desc: "Sự hòa quyện thú vị giữa ẩm thực Hàn Quốc và hiện đại với xúc xích, đậu hũ, kimchi, mì ramen và đặc biệt là phô mai béo ngậy tan chảy trong nước dùng đậm đà.",
    ingred: "Xúc xích cao cấp, thịt hộp (spam), mì ramen, phô mai lát, đậu phụ, kimchi, bánh gạo, hành tây, sốt lẩu Budae đặc biệt."
  },
  "Cơm cuộn Kimbap": {
    desc: "Từng khoanh cơm cuộn tròn trịa, bắt mắt với nhân đa dạng được bao bọc bởi lớp rong biển Hàn Quốc hảo hạng. Món ăn nhẹ đầy đủ dinh dưỡng và vô cùng tiện lợi.",
    ingred: "Cơm dẻo, lá rong biển khô, thanh cua, trứng chiên, xúc xích, cà rốt, dưa chuột, củ cải muối vàng, rau chân vịt, dầu mè tinh khiết."
  },
  "Cơm chiên Kimchi": {
    desc: "Cơm chiên cùng Kimchi cải thảo chua cay, thịt heo bằm và trứng ốp la lòng đào, tạo nên món ăn đơn giản nhưng cực kỳ lôi cuốn vị giác.",
    ingred: "Cơm trắng dẻo, Kimchi cải thảo bằm nhỏ, thịt heo nạc, trứng gà, hành lá, dầu mè, rong biển vụn trang trí."
  },
  "Mì đen Jajangmyeon": {
    desc: "Món mì trộn huyền thoại với nước sốt tương đen sánh mịn, béo ngậy được xào cùng thịt heo và khoai tây, mang đến trải nghiệm hài hòa tinh tế.",
    ingred: "Mì sợi to đặc biệt, tương đen Hàn Quốc (Chunjang), thịt heo nạc, hành tây, khoai tây, bí ngòi, dưa chuột tươi xắt sợi."
  },
  "Bánh gạo Tteokbokki": {
    desc: "Những miếng bánh gạo dẻo mịn quyện trong nước sốt ớt đỏ rực, cay nồng đậm đà, ăn kèm chả cá và trứng luộc – biểu tượng của văn hóa vỉa hè Seoul.",
    ingred: "Bánh gạo (Tteok), chả cá lát (Eomuk), nước sốt ớt cay truyền thống, trứng luộc, bắp cải, hành lá, vừng trắng trang trí."
  },
  "Soju truyền thống": {
    desc: "Thức uống quốc hồn quốc túy của Hàn Quốc với nồng độ nhẹ nhàng, vị tinh khiết thanh thoát, là người bạn đồng hành hoàn hảo cho các món lẩu và gà rán.",
    ingred: "Quốc tửu Soju Hàn Quốc chính gốc, đá tinh khiết, trà hoặc chanh dùng kèm tùy sở thích."
  },
  "Sữa gạo": {
    desc: "Thanh lọc cơ thể với thức uống sữa gạo truyền thống, vị ngọt thanh tự nhiên và hương thơm dịu nhẹ từ gạo rang, cung cấp năng lượng và hỗ trợ tiêu hóa.",
    ingred: "Gạo rang vàng thơm, sữa tươi tách béo, nước lọc tinh khiết, đường phèn tự nhiên, đá sạch."
  }
};

async function updateAllProductDetails() {
  try {
    await mongoose.connect(uri);
    console.log('Đã kết nối DB để cập nhật chi tiết đồng bộ...');

    let updatedCount = 0;
    const products = await Models.Product.find({});

    for (const prod of products) {
      const match = productData[prod.name];
      if (match) {
        await Models.Product.findByIdAndUpdate(prod._id, { 
          description: match.desc,
          ingredients: match.ingred
        });
        updatedCount++;
      }
    }

    console.log(`Hoàn tất! Đã cập nhật chi tiết thủ công cho ${updatedCount} sản phẩm khớp tên.`);
    process.exit(0);
  } catch (err) {
    console.error('Lỗi khi cập nhật:', err);
    process.exit(1);
  }
}

updateAllProductDetails();
