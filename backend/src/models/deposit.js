const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let transactionDepositModel = connection.define('deposit',
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
            allowNull: true,
            type: sequelize.STRING
          },
          payment: {
            allowNull: true,
            type: sequelize.STRING
          },
          statusPayment: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          from: {
            allowNull: false,
            type: sequelize.STRING
          },
          to: {
            allowNull: true,
            type: sequelize.STRING
          },
          userId: {
            type: sequelize.UUID,
            allowNull: true,
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
          tableName: 'deposit'
        }
    );

    return transactionDepositModel;

};