'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('films', {
      id: {
        unique: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      title: {
        unique: true,
        type: Sequelize.STRING,
        allowNull: false,
      },
      episode_id: {
        unique: true,
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      opening_crawl: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      director: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      producer: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      release_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      characters: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      planets: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      starships: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      vehicles: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      species: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      url: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('films');
  },
};
