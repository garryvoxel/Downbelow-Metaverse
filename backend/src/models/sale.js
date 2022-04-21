const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let saleModel = connection.define('sale',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          amount: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          discount: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          subtotal: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          total: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          paymentMethod: {
            allowNull: true,
            type: sequelize.STRING
          },
          statusPayment: {
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
          tableName: 'sale'
        }
    );

    return saleModel;

};