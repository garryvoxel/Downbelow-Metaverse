'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn('floor', 'typePartyContractId', {
      type: Sequelize.UUID,
      references: {
        model: 'typePartyContract',
        key: 'id'
      },
      after: 'provisionRequirement'
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('floor', 'typePartyContractId');
  }
};