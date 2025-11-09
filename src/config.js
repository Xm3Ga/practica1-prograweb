const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  PORT: process.env.PORT || 3000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/portal_productos',
  JWT_SECRET: process.env.JWT_SECRET || 'mi_secreto_super_seguro_para_jwt_2024',
  JWT_EXPIRE: '7d'
};
