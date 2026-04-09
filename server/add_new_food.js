const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const MyConstants = require('./utils/MyConstants');
const { Category, Product } = require('./models/Models');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

async function addTenProducts() {
  await mongoose.connect(uri);
  console.log('Connected to DB');

  const cats = await Category.find({});
  const catMap = {};
  cats.forEach(c => catMap[c.name] = c);

  const imagesDir = 'C:\\Users\\ASUS\\.gemini\\antigravity\\brain\\a373b11c-b4b8-4fd5-8b28-c93994369125';
  
  const newProducts = [
    {
      name: 'Cơm bò Bulgogi',
      price: 95000,
      imageFile: 'rice_bulgogi_1775701207822.png',
      description: 'Món cơm bò xào đặc trưng với thịt bò mềm được ướp trong sốt đậu nành ngọt thanh, ăn kèm với rau củ và cơm trắng nóng hổi.',
      ingredients: 'Thịt bò Mỹ, hành tây, nấm hương, sốt bulgogi, vừng trắng, cơm gạo dẻo.',
      categoryName: 'Cơm'
    },
    {
      name: 'Gimbap Chiên Giòn',
      price: 75000,
      imageFile: 'gimbap_fried_1775701224674.png',
      description: 'Sự kết hợp hoàn hảo giữa cơm cuộn truyền thống và lớp vỏ chiên xù giòn tan bên ngoài, mang lại cảm giác thú vị khi thưởng thức.',
      ingredients: 'Rong biển, cơm, trứng, xúc xích, cà rốt, dưa chuột, bột chiên xù.',
      categoryName: 'Cơm'
    },
    {
      name: 'Mì Cay Hải Sản Jjamppong',
      price: 95000,
      imageFile: 'jjamppong_noodle_1775701244960.png',
      description: 'Mì nước hải sản cay nồng với nước dùng được ninh từ xương và hải sản tươi sống, đậm đặc hương vị biển cả.',
      ingredients: 'Mì sợi, tôm, mực, ngao, bắp cải, hành tây, ớt bột Hàn Quốc.',
      categoryName: 'Mì'
    },
    {
      name: 'Mì trộn cay Jjolmyeon',
      price: 75000,
      imageFile: 'jjolmyeon_cold_noodle_1775701266049.png',
      description: 'Mì trộn với sợi mì dai giòn đặc biệt, hòa quyện cùng sốt ớt chua cay kích thích vị giác.',
      ingredients: 'Mì Jjolmyeon, giá đỗ, dưa chuột, rau thơm, trứng luộc, sốt ớt cay ngọt.',
      categoryName: 'Mì'
    },
    {
      name: 'Lẩu Bạch Tuộc Cay (Nakji-jeongol)',
      price: 250000,
      imageFile: 'nakji_hotpot_ct_1775701281703.png',
      description: 'Nồi lẩu bạch tuộc đầy đặn với vị cay nồng đặc trưng, thích hợp cho những buổi tụ họp bạn bè.',
      ingredients: 'Bạch tuộc tươi, nấm các loại, cải thảo, hành baro, đậu phụ, nước lẩu cay.',
      categoryName: 'Lẩu'
    },
    {
      name: 'Lẩu Nấm Thập Cẩm',
      price: 195000,
      imageFile: 'mushroom_hotpot_ct_1775701298429.png',
      description: 'Món lẩu thanh đạm với các loại nấm tươi ngon, giàu dinh dưỡng, mang lại cảm giác nhẹ nhàng cho bữa ăn.',
      ingredients: 'Nấm kim châm, nấm hương, nấm đùi gà, rau cải, đậu hũ, nước dùng xương thanh ngọt.',
      categoryName: 'Lẩu'
    },
    {
      name: 'Sườn Bò Nướng Galbi',
      price: 150000,
      imageFile: 'galbi_ribs_ct_1775701320144.png',
      description: 'Sườn bò được tẩm ướp kỹ lưỡng và nướng trên lò than, giữ được độ mềm và vị ngọt tự nhiên của thịt.',
      ingredients: 'Sườn bò, tỏi, mật ong, gừng, xì dầu, sả, hành tím.',
      categoryName: 'Món phụ'
    },
    {
      name: 'Canh Bánh Xếp Mandu-guk',
      price: 85000,
      imageFile: 'mandu_soup_ct_1775701338140.png',
      description: 'Bát canh ấm áp với những viên bánh xếp vỏ mỏng nhân đầy đặn, nước dùng thanh tao.',
      ingredients: 'Bánh xếp (Mandu), trứng, rong biển khô, hành lá, nước dùng bò.',
      categoryName: 'Món phụ'
    },
    {
      name: 'Trà Sữa Khoai Lang Tím',
      price: 45000,
      imageFile: 'purple_potato_tea_ct_1775701354969.png',
      description: 'Thức uống độc đáo với vị bùi bùi của khoai lang tím hòa cùng sữa béo ngậy và trân châu dai giòn.',
      ingredients: 'Khoai lang tím tươi, trà đen, sữa tươi, trân châu đen, đường phèn.',
      categoryName: 'Đồ uống'
    },
    {
      name: 'Nước Ép Lê Hàn Quốc',
      price: 35000,
      imageFile: 'pear_juice_ct_1775701372319.png',
      description: 'Nước ép nguyên chất từ những quả lê Hàn Quốc mọng nước, giúp giải nhiệt và thanh lọc cơ thể.',
      ingredients: 'Lê Hàn Quốc tươi, đá viên, mật ong (tùy chọn).',
      categoryName: 'Đồ uống'
    }
  ];

  const now = Date.now();
  let count = 0;

  for (const p of newProducts) {
    const category = catMap[p.categoryName];
    if (category) {
      const imgPath = path.join(imagesDir, p.imageFile);
      if (fs.existsSync(imgPath)) {
        const base64Image = fs.readFileSync(imgPath, { encoding: 'base64' });
        
        const product = new Product({
          _id: new mongoose.Types.ObjectId(),
          name: p.name,
          price: p.price,
          image: base64Image,
          description: p.description,
          ingredients: p.ingredients,
          cdate: now,
          category: {
            _id: category._id,
            name: category.name
          }
        });

        await product.save();
        console.log(`Added: ${p.name}`);
        count++;
      } else {
        console.log(`Image not found: ${imgPath}`);
      }
    } else {
      console.log(`Category not found: ${p.categoryName}`);
    }
  }

  console.log(`Successfully added ${count} products.`);
  process.exit(0);
}

addTenProducts().catch(err => {
  console.error(err);
  process.exit(1);
});
