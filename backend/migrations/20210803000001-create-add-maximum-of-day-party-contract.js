'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('partyContract', 'maximumOfDay', {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      after: 'endDate'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('partyContract', 'maximumOfDay');
  }
};