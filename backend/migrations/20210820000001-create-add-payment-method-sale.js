'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('sale', 'paymentMethod', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'total'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('sale', 'paymentMethod');
  }
};