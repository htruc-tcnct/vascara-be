"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the description column to the categories table
    await queryInterface.addColumn("categories", "description", {
      type: Sequelize.TEXT, // Use TEXT for longer descriptions
      allowNull: true, // Set to true if the field is optional
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the description column if the migration is rolled back
    await queryInterface.removeColumn("categories", "description");
  },
};
