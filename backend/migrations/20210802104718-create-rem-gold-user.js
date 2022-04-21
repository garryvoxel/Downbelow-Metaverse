'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'gold');
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('user', 'gold');
  }
};