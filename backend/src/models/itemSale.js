const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let itemSaleModel = connection.define('itemSale',
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
          amountSpent: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          price: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          total: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          saleId: {
            type: sequelize.UUID,
            references: {
              model: 'sale',
              key: 'id'
            }
          },
          productId: {
            type: sequelize.UUID,
            references: {
              model: 'product',
              key: 'id'
            }
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
          tableName: 'itemSale'
        }
    );

    return itemSaleModel;

};