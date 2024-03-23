const Sequelize = require("sequelize");
const sequelize = require("../db");
const { v4: uuidv4 } = require("uuid");

module.exports = () => {
  const User = sequelize.define("User", {
    userId: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: () => uuidv4(),
    },

    fullName: {
      type: Sequelize.STRING,
      allowNull: false,
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  });

  return User;
};
