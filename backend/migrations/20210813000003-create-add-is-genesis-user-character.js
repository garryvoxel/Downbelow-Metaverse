'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userCharacter', 'isGenesis', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'retired'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userCharacter', 'isGenesis');
  }
};