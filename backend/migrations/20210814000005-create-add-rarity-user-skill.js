'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userSkill', 'rarity', {
      type: Sequelize.STRING(),
      after: 'price'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userSkill', 'rarity');
  }
};