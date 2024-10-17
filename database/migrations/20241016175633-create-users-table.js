'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.sequelize.query(
        `CREATE TYPE roles_enum AS ENUM (
          'ADMIN', 'USER'
        );`,
        { transaction },
      );
      await queryInterface.createTable(
        'users',
        {
          id: {
            unique: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            type: Sequelize.INTEGER,
          },
          email: {
            unique: true,
            allowNull: false,
            type: Sequelize.STRING,
          },
          password: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          first_name: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          last_name: {
            allowNull: false,
            type: Sequelize.STRING,
          },
          role: {
            type: 'roles_enum',
            allowNull: false,
            defaultValue: 'USER',
          },
          created_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          updated_at: {
            allowNull: false,
            type: Sequelize.DATE,
            defaultValue: Sequelize.NOW,
          },
          deleted_at: {
            allowNull: true,
            type: Sequelize.DATE,
          },
        },
        { transaction },
      );
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('users', { transaction });
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS roles_enum');
    });
  },
};
