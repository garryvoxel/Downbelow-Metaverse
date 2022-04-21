'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('weapon', 'name', {
      allowNull: true,
      type: Sequelize.STRING,
      after: 'id'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('weapon', 'name');
  }
};