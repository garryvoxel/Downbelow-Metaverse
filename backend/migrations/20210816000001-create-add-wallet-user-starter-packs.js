'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userStarterPacks', 'walletAddress', {
      type: Sequelize.STRING,
      allowNull: false,
      after: 'statusPayment'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userStarterPacks', 'walletAddress');
  }
};