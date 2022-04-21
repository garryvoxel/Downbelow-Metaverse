'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('withdraw', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      type: {
        allowNull: false,
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      contents: {
        allowNull: true,
        type: Sequelize.STRING
      },
      payment: {
        allowNull: true,
        type: Sequelize.STRING
      },
      statusPayment: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      from: {
        allowNull: true,
        type: Sequelize.STRING
      },
      to: {
        allowNull: false,
        type: Sequelize.STRING
      },
      dateRequest: {
        allowNull: false,
        type: Sequelize.DATE
      },
      datePayment: {
        allowNull: true,
        type: Sequelize.DATE
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'user',
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
              fields: ['id', 'walletAddress']
          }
      ]
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('withdraw');
  }
};