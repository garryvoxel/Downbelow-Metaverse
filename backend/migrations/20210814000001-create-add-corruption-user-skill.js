'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userSkill', 'corruption', {
      type: Sequelize.INTEGER(),
      defaultValue: 0,
      after: 'isEquipped'
      
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userSkill', 'corruption');
  }
};