'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('skill', 'name', {
      allowNull: false,
      type: Sequelize.STRING,
      after: 'id'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('skill', 'name');
  }
};