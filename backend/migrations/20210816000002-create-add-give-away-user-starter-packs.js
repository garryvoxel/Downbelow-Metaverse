'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userStarterPacks', 'giveAway', {
      type: Sequelize.INTEGER(1),
      defaultValue: 0,
      after: 'walletAddress'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userStarterPacks', 'giveAway');
  }
};