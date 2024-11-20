"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true,
      },
      phonenumber: {
        type: Sequelize.STRING(10),
        allowNull: true,
        unique: true,
      },
      name: {
        type: Sequelize.STRING(100),
      },
      role: {
        type: Sequelize.ENUM("admin", "user"),
        defaultValue: "user",
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM("male", "female", "other"),
        allowNull: true,
        defaultValue: "other",
      },
      address: {
        type: Sequelize.JSON,
        allowNull: true,
        defaultValue: {
          province: null,
          district: null,
          ward: null,
          detail: null,
        },
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface) => {
    // Simply drop the table
    await queryInterface.dropTable("users");
  },
};
