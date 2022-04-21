const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let purchaseWhitelistModel = connection.define('purchaseWhitelist',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          total: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          starterPacksId: {
            allowNull: false,
            type: sequelize.STRING
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
          tableName: 'purchaseWhitelist'
        }
    );

    return purchaseWhitelistModel;

};