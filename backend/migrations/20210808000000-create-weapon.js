'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('weapon', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      description: {
        allowNull: false,
        type: Sequelize.STRING
      },
      rarity: {
        allowNull: false,
        type: Sequelize.STRING
      },
      ap: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      damageBonus: {
        type: Sequelize.FLOAT(),
        defaultValue: 0,
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
    return queryInterface.dropTable('weapon');
  }
};