'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('user', 'abyssUnclaimed', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'abyss'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'abyssUnclaimed');
  }
};