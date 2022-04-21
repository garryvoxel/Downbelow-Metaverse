'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('whitelist', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.STRING,
        unique: true
      },
      createdAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: true,
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
    return queryInterface.dropTable('whitelist');
  }
};