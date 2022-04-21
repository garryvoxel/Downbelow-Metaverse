'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('product', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        unique: true
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING,
        unique: true
      },
      description: {
        allowNull: true,
        type: Sequelize.STRING
      },
      image: {
        allowNull: true,
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      amount: {
        type: Sequelize.INTEGER(),
        defaultValue: 0,
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
    return queryInterface.dropTable('product');
  }
};