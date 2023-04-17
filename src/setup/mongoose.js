const mongoose = require('mongoose');

module.exports.setupDbConnection = async () => {
 await mongoose.connect(process.env.MONGO_DB_URI);
};