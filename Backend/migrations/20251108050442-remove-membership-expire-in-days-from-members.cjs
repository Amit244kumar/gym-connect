"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("members", "membership_expire_in_days");
  },

  async down(queryInterface, Sequelize) {
    // Optional: re-add the column if you ever undo the migration
    await queryInterface.addColumn("members", "membership_expire_in_days", {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  }
};
