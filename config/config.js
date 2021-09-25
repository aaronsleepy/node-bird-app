require('dotenv').config();

module.exports = {
  development: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "node-bird",
    host: "127.0.0.1",
    port: 23306,
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "node-bird",
    host: "127.0.0.1",
    port: 23306,
    dialect: "mysql"
  },
  production: {
    username: "root",
    password: process.env.SEQUELIZE_PASSWORD,
    database: "node-bird",
    host: "127.0.0.1",
    port: 23306,
    dialect: "mysql"
  },
};