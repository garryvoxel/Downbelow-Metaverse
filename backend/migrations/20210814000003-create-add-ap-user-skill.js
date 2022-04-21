'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userSkill', 'ap', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'id'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userSkill', 'ap');
  }
};