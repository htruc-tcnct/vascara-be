"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add new columns for codes and names
      await queryInterface.addColumn(
        "address",
        "province_code",
        {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "province_name",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "district_code",
        {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "district_name",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "ward_code",
        {
          type: Sequelize.STRING(10),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "ward_name",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      // Remove old combined columns
      await queryInterface.removeColumn("address", "province", { transaction });
      await queryInterface.removeColumn("address", "district", { transaction });
      await queryInterface.removeColumn("address", "ward", { transaction });
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Re-add old columns
      await queryInterface.addColumn(
        "address",
        "province",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "district",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      await queryInterface.addColumn(
        "address",
        "ward",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      // Remove new columns
      await queryInterface.removeColumn("address", "province_code", {
        transaction,
      });
      await queryInterface.removeColumn("address", "province_name", {
        transaction,
      });
      await queryInterface.removeColumn("address", "district_code", {
        transaction,
      });
      await queryInterface.removeColumn("address", "district_name", {
        transaction,
      });
      await queryInterface.removeColumn("address", "ward_code", {
        transaction,
      });
      await queryInterface.removeColumn("address", "ward_name", {
        transaction,
      });
    });
  },
};
