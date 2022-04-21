const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let transactionAbyssUnclaimedModel = connection.define('transactionAbyssUnclaimed',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          type: {
            allowNull: false,
            type: sequelize.STRING
          },
          value: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          contents: {
            allowNull: false,
            type: sequelize.STRING
          },
          status: {
            type: sequelize.INTEGER(2),
            defaultValue: 0,
          },
          userId: {
            type: sequelize.UUID,
            references: {
              model: 'user',
              key: 'id'
            }
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
          tableName: 'transactionAbyssUnclaimed'
        }
    );

    return transactionAbyssUnclaimedModel;

};