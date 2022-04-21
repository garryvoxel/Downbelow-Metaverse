'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    
    const characterList = ['ASSASSIN', 'MAGE', 'PRIEST', 'ARCHER', 'KNIGHT', 'BRAWLER'];
    let character = [];
    characterList.forEach((item) => {
      character.push(
        {
          id: uuidv4(),
          className: item,
          ap: 0,
          damage: 0,
          defense: 0,
          criticalChance: 0,
          accuracy: 0,
          dodge: 0,
          speed: 0,
          life: 0,
          status: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        });
    });

    await queryInterface.bulkInsert('character', character, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('character', null, {});
  }
};



