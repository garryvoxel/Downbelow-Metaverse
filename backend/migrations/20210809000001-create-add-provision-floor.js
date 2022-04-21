'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('floor', 'provisionRequirement', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'elvenSilver'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'provisionRequirement');
  }
};