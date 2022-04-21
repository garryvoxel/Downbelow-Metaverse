'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('user', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      nike: {
        type: Sequelize.STRING
      },
      email: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      password: {
        allowNull: false,
        type: Sequelize.STRING
      },
      walletAddress: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      typeWallet: {
        type: Sequelize.STRING
      },
      abyss: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      gold: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      elvenSilver: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      rations: {
        type: Sequelize.DOUBLE()
      },
      arenaTickets: {
        type: Sequelize.INTEGER(),
      },
      playedPvE: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      tokenApplication: {
        type: Sequelize.STRING
      },
      refreshToken: {
        type: Sequelize.STRING
      },
      activeToken: {
        type: Sequelize.STRING
      },
      codeActive: {
        type: Sequelize.STRING
      },
      dateCodeActive: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.INTEGER(2),
        defaultValue: 0,
      },
      typeUserId: {
        type: Sequelize.UUID,
        references: {
          model: 'typeUser',
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
              fields: ['id', 'email', 'walletAddress']
          }
      ]
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('user');
  }
};