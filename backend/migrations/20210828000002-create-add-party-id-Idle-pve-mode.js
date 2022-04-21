'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('idlePveMode', 'partyId', {
      type: Sequelize.UUID,
      references: {
        model: 'party',
        key: 'id'
      },
      after: 'floorId'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('idlePveMode', 'partyId');
  }
};