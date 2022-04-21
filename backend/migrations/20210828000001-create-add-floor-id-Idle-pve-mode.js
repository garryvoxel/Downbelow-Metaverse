'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('idlePveMode', 'floorId', {
      type: Sequelize.UUID,
      references: {
        model: 'floor',
        key: 'id'
      },
      after: 'userId'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('idlePveMode', 'floorId');
  }
};