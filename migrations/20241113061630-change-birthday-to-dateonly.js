"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "birthday", {
      type: Sequelize.DATEONLY,
      allowNull: true, // Keep the same as in the original migration, adjust if needed
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn("users", "birthday", {
      type: Sequelize.DATE,
      allowNull: true, // Match the original definition
    });
  },
};
