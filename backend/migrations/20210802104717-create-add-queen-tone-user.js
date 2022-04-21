'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('user', 'queenStone', {
      type: Sequelize.DOUBLE(),
      defaultValue: 0,
      after: 'rations'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'queenStone');
  }
};