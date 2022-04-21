const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let userStarterPacksModel = connection.define('userStarterPacks',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          name: {
            allowNull: false,
            type: sequelize.STRING
          },
          price: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          amountCharacter: {
            type: sequelize.INTEGER(11)
          },
          amountWeapon: {
            type: sequelize.INTEGER(11)
          },
          amountSkills: {
            type: sequelize.INTEGER(11)
          },
          starterPacksId: {
            allowNull: false,
            type: sequelize.STRING
          },
          openPackage: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          totalTransfer: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          payment: {
            allowNull: true,
            type: sequelize.STRING
          },
          statusPayment: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          walletAddress: {
            allowNull: false,
            type: sequelize.STRING,
            unique: true
          },
          giveAway: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          userId: {
            type: sequelize.UUID,
            references: {
              model: 'user',
              key: 'id'
            }
          },
          status: {
            type: sequelize.INTEGER(2),
            defaultValue: 0,
          },
          createdAt: {
            allowNull: false,
            type: sequelize.DATE
          },
          updatedAt: {
            allowNull: false,
            type: sequelize.DATE
          }
        },
        {
          tableName: 'userStarterPacks'
        }
    );

    return userStarterPacksModel;

};