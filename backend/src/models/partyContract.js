const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let partyContractModel = connection.define('partyContract',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          description: {
            type: sequelize.STRING
          },
          startDate: {
            type: sequelize.DATE
          },
          endDate: {
            type: sequelize.DATE
          },
          maximumOfDay: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          breachOfContract: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          paymentMethod: {
            allowNull: true,
            type: sequelize.STRING
          },
          value: {
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
          tableName: 'partyContract'
        }
    );

    return partyContractModel;

};