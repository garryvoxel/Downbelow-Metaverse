'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userCharacterSkill', 'skillId', {
      type: Sequelize.UUID,
      references: {
        model: 'skill',
        key: 'id'
      },
      after: 'userSkillId'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userCharacterSkill', 'skillId');
  }
};