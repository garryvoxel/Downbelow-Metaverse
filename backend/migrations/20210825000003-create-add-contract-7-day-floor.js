'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('floor', 'contract7Day', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'contract1Day'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'contract7Day');
  }
};