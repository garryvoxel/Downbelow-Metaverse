'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('party', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      description: {
        type: Sequelize.STRING
      },
      ap: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      exhausted: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      salary: {
        type: Sequelize.DECIMAL(30, 18)
      },
      partyContractId: {
        type: Sequelize.UUID,
        references: {
          model: 'partyContract',
          key: 'id'
        }
      },
      status: {
        type: Sequelize.INTEGER(2),
        defaultValue: 0,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    {
      indexes: [
          {
              unique: true,
              fields: ['id']
          }
      ]
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('party');
  }
};