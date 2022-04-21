'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userWeapon', 'price', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'id'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userWeapon', 'price');
  }
};