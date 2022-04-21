'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('partyCharacter', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      partyId: {
        type: Sequelize.UUID,
        references: {
          model: 'party',
          key: 'id'
        }
      },
      userCharacterId: {
        allowNull: true,
        type: Sequelize.UUID,
        defaultValue: null,
        references: {
          model: 'userCharacter',
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
    return queryInterface.dropTable('partyCharacter');
  }
};