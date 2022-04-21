'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('idlePveMode', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      resultRandom: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      randomBaseChance: {
        type: Sequelize.DOUBLE(),
        defaultValue: 0,
      },
      result: {
        type: Sequelize.DOUBLE(),
        defaultValue: 0,
      },
      apParty: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      baseChance: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      apRequirement: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      multiplier: {
        type: Sequelize.DOUBLE(),
        defaultValue: 0,
      },
      rewards: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      elvenSilver: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      status: {
        type: Sequelize.INTEGER(2),
        defaultValue: 0,
      },
      userId: {
        type: Sequelize.UUID,
        references: {
          model: 'user',
          key: 'id'
        }
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
    return queryInterface.dropTable('idlePveMode');
  }
};