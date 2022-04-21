const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let typePartyContractModel = connection.define('typePartyContract',
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
          duration: {
            type: sequelize.INTEGER(2),
          },
          price: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
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
          tableName: 'typePartyContract'
        }
    );

    return typePartyContractModel;

};