'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userCharacter', 'price', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'rarity'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userCharacter', 'price');
  }
};