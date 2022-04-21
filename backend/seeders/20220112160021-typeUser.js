'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'typeUser', 
      [
        {
          id: '1',
          description: 'System',
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          description: 'Player',
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('typeUser', null, {});
  }
};
