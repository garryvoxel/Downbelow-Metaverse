'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('character', 'price', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'life'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('character', 'price');
  }
};