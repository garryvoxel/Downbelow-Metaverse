'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('userCharacterWeapon', 'weaponId', {
      type: Sequelize.UUID,
      references: {
        model: 'weapon',
        key: 'id'
      },
      after: 'userWeaponId'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('userCharacterWeapon', 'weaponId');
  }
};