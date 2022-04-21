'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'gold');
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'gold');
  }
};