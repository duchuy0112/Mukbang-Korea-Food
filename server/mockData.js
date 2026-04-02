require('./utils/MongooseUtil');
const mongoose = require('mongoose');
const { Customer, Product, Order } = require('./models/Models');

async function seedOrders() {
  await new Promise(resolve => setTimeout(resolve, 3000)); // wait for mongoose connection

  console.log("Starting mock data generation...");

  const customers = await Customer.find({});
  const products = await Product.find({});

  if (customers.length === 0 || products.length === 0) {
    console.log("No customers or products found. Cannot seed.");
    process.exit(1);
  }

  const statuses = ['APPROVED', 'APPROVED', 'APPROVED', 'PENDING', 'CANCELED'];
  let created = 0;

  for (const customer of customers) {
    // Generate 3 to 10 orders per customer to make it lively
    const numOrders = Math.floor(Math.random() * 8) + 3;
    
    for (let i = 0; i < numOrders; i++) {
        const orderId = new mongoose.Types.ObjectId();
        // Random date in the last few months (scattered)
        const date = new Date();
        const pastMonths = Math.floor(Math.random() * 5); // 0 to 4 months ago
        const pastDays = Math.floor(Math.random() * 28);
        date.setMonth(date.getMonth() - pastMonths);
        date.setDate(date.getDate() - pastDays);
        
        const numItems = Math.floor(Math.random() * 3) + 1;
        const items = [];
        let total = 0;

        for (let j = 0; j < numItems; j++) {
            const product = products[Math.floor(Math.random() * products.length)];
            if (!items.find(item => item.product._id.toString() === product._id.toString())) {
                const quantity = Math.floor(Math.random() * 3) + 1;
                items.push({ product, quantity });
                total += (product.price || 0) * quantity;
            }
        }

        if (items.length > 0) {
            const status = statuses[Math.floor(Math.random() * statuses.length)];
            const order = new Order({
                _id: orderId,
                cdate: date.getTime(),
                total: total,
                status: status,
                customer: customer,
                items: items
            });
            await order.save();
            created++;
        }
    }
  }

  console.log(`Successfully created ${created} mock orders!`);
  process.exit(0);
}

seedOrders().catch(err => {
  console.error(err);
  process.exit(1);
});
