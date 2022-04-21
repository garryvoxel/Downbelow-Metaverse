'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('skill', 'price', {
      type: Sequelize.DECIMAL(30, 18),
      defaultValue: 0,
      after: 'ap'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('skill', 'price');
  }
};