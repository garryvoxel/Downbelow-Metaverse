'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userSkill', 'retired', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'corruption'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userSkill', 'retired');
  }
};