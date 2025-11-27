// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
module.exports = {
  user: process.env.NODE_ORACLEDB_USER_HISTO,
  password: process.env.NODE_ORACLEDB_PASSWORD_HISTO,
  connectString: process.env.NODE_ORACLEDB_CONNECTIONSTRING_HISTO,
  externalAuth: false,
};
