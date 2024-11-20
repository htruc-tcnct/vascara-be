"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "phonenumber", {
      type: Sequelize.STRING(20),
      allowNull: true, // or false if it should be required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "phonenumber");
  },
};
