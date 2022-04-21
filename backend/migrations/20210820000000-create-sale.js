'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('sale', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      amount: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      discount: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      subtotal: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      statusPayment: {
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
    return queryInterface.dropTable('sale');
  }
};