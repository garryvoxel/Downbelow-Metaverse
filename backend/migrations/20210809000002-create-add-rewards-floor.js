'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('floor', 'rewards', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'elvenSilver'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'rewards');
  }
};