'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('floor', 'contract1Day', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'provisionRequirement'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'contract1Day');
  }
};