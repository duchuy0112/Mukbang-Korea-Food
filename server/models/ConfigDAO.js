const mongoose = require('mongoose');
const { Config } = require('./Models');

const ConfigDAO = {
  async select() {
    const query = {};
    const config = await Config.findOne(query).exec();
    return config;
  },
  async update(config) {
    const query = { _id: config._id };
    const result = await Config.updateOne(query, config);
    return result;
  },
  async insert(config) {
    config._id = new mongoose.Types.ObjectId();
    const result = await Config.create(config);
    return result;
  }
};

module.exports = ConfigDAO;
