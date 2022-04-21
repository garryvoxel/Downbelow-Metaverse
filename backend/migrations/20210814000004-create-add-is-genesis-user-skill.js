'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userSkill', 'isGenesis', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'retired'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userSkill', 'isGenesis');
  }
};