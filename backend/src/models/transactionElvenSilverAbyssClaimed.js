const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let transactionElvenSilverAbyssClaimedModel = connection.define('transactionElvenSilverAbyssClaimed',
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
          tableName: 'transactionElvenSilverAbyssClaimed'
        }
    );

    return transactionElvenSilverAbyssClaimedModel;

};