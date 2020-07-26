const bcrypt = require("bcryptjs");
const Sequelize = require("sequelize");

const sequelize = require("../config/connection.js");

const salt = bcrypt.genSaltSync(10);

const schema = {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
};

const User = sequelize.define("user", schema);

User.prototype.validPassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

User.addHook("beforeCreate", (user) => {
  user.password = bcrypt.hashSync(user.password, salt, null);
});

User.sync();

module.exports = User;
