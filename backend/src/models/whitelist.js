const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let whitelistModel = connection.define('whitelist',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.STRING,
            unique: true
          },
          createdAt: {
            allowNull: true,
            type: sequelize.DATE
          },
          updatedAt: {
            allowNull: true,
            type: sequelize.DATE
          }
        },
        {
          tableName: 'whitelist'
        }
    );

    return whitelistModel;

};