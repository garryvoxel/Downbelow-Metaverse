'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('userStarterPacks', {
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
      price: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      amountCharacter: {
        type: Sequelize.INTEGER(11)
      },
      amountWeapon: {
        type: Sequelize.INTEGER(11)
      },
      amountSkills: {
        type: Sequelize.INTEGER(11)
      },
      starterPacksId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      openPackage: {
        type: Sequelize.INTEGER(1),
        defaultValue: 0,
      },
      totalTransfer: {
        type: Sequelize.DECIMAL(30, 18),
        defaultValue: 0,
      },
      payment: {
        allowNull: true,
        type: Sequelize.STRING
      },
      statusPayment: {
        type: Sequelize.INTEGER(1),
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
    return queryInterface.dropTable('userStarterPacks');
  }
};