'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('userCharacter', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      rarity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ap: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      damage: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      criticalChance: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      accuracy: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      defense: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      dodge: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      life: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      speed: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
      },
      characterId: {
        type: Sequelize.UUID,
        references: {
          model: 'character',
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
    return queryInterface.dropTable('userCharacter');
  }
};