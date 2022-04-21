'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('itemSale', {
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
      amountSpent: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
      },
      price: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      total: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      saleId: {
        type: Sequelize.UUID,
        references: {
          model: 'sale',
          key: 'id'
        }
      },
      productId: {
        type: Sequelize.UUID,
        references: {
          model: 'product',
          key: 'id'
        }
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
    return queryInterface.dropTable('itemSale');
  }
};