const Sequelize = require("sequelize");
const sequelize = require("../config/connection.js");
const schema = {
  game_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  game_name: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  genre: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  user_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  favourite_game: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
};
const Games = sequelize.define("games", schema);
Games.sync();

module.exports = Games;
