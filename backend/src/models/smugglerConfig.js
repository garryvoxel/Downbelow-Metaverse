const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let smugglerConfigModel = connection.define('smugglerConfig',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          feePercentage: {
            type: sequelize.DECIMAL(12, 2),
            defaultValue: 0,
          },
          startDate: {
            allowNull: true,
            type: sequelize.DATE
          },
          endDate: {
            allowNull: true,
            type: sequelize.DATE
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
          tableName: 'smugglerConfig'
        }
    );

    return smugglerConfigModel;

};