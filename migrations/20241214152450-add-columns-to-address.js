"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Add new columns for province_code, district_code, and ward_code
      await queryInterface.addColumn(
        "address",
        "province_code",
        {
          type: Sequelize.STRING(100), // Đúng với cấu trúc bảng hiện tại
          allowNull: false,
        },
        { transaction }
      );

      // Remove "province_name" as it is not in the table
      // Add district_code
      await queryInterface.addColumn(
        "address",
        "district_code",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      // Add ward_code
      await queryInterface.addColumn(
        "address",
        "ward_code",
        {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        { transaction }
      );

      // Remove "province", "district", "ward" if these columns exist
      // You should verify these columns exist before running migration
      await queryInterface
        .removeColumn("address", "province", { transaction })
        .catch(() => {});
      await queryInterface
        .removeColumn("address", "district", { transaction })
        .catch(() => {});
      await queryInterface
        .removeColumn("address", "ward", { transaction })
        .catch(() => {});
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Re-add old columns province, district, and ward
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

      // Remove the added columns (province_code, district_code, ward_code)
      await queryInterface.removeColumn("address", "province_code", {
        transaction,
      });
      await queryInterface.removeColumn("address", "district_code", {
        transaction,
      });
      await queryInterface.removeColumn("address", "ward_code", {
        transaction,
      });
    });
  },
};
