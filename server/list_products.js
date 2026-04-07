const dns = require('dns');
dns.setServers(['1.1.1.1', '1.0.0.1']);
const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const Models = require('./models/Models');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

async function listProductNames() {
  try {
    await mongoose.connect(uri);
    const products = await Models.Product.find({}, 'name description ingredients');
    products.forEach(p => console.log(`PROD: ${p.name}`));
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

listProductNames();
