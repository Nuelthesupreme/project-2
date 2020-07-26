const Sequelize = require("sequelize");

// If in development mode, use the local options

const localOptions = {
  host: "localhost",
  port: 3306,
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

// Production mode, use the productionOptions

const productionOptions = {
  host: process.env.HOSTNAME,
  port: 3306,
  dialect: "mysql",
  use_env_variable: "JAWSDB_URL",
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
};

let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.USERNAME,
    process.env.PASSWORD,
    productionOptions
  );
} else {
  sequelize = new Sequelize("ez_games", "root", "password", localOptions);
}

module.exports = sequelize;
