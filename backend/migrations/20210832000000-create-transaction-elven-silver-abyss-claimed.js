'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('transactionElvenSilverAbyssClaimed', {
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
        allowNull: false,
        type: Sequelize.STRING
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
    return queryInterface.dropTable('transactionElvenSilverAbyssClaimed');
  }
};