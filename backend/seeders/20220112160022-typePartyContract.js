'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'typePartyContract', 
      [
        {
          id: '1',
          name: '1 day contract',
          duration: 1,
          price: 0,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: '2',
          name: '7 day contract',
          duration: 1,
          price: 0,
          status: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      ], 
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('typePartyContract', null, {});
  }
};
