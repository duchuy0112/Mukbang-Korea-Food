require('../utils/MongooseUtil');
const Models = require('./Models');

const AdminDAO = {
  async selectByUsername(username) {
    const query = { username: username };
    const admin = await Models.Admin.findOne(query);
    return admin;
  },
  async updatePassword(username, password) {
    const query = { username: username };
    const admin = await Models.Admin.findOneAndUpdate(query, { password: password }, { new: true });
    return admin;
  }
};

module.exports = AdminDAO;
