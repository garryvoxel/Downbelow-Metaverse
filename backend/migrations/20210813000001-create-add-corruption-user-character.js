'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userCharacter', 'corruption', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'speed'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userCharacter', 'corruption');
  }
};