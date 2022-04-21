'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('partyContract', 'paymentMethod', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'maximumOfDay'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('partyContract', 'paymentMethod');
  }
};