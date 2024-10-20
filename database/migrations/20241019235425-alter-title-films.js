'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('films', 'films_title_key');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('films', {
      fields: ['title'],
      type: 'unique',
      name: 'films_title_key',
    });
  },
};
