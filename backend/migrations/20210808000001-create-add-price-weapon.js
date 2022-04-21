'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('weapon', 'price', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'damageBonus'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('weapon', 'price');
  }
};