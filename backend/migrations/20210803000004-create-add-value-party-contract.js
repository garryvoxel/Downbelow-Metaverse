'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('partyContract', 'value', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'paymentMethod'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('partyContract', 'value');
  }
};