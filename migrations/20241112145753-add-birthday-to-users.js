"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("users", "birthday", {
      type: Sequelize.DATE,
      allowNull: true, // Adjust if the column is required
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("users", "birthday");
  },
};
