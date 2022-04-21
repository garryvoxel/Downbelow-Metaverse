'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userWeapon', 'corruption', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'isEquipped'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userWeapon', 'corruption');
  }
};