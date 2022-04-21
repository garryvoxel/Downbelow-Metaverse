const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let productModel = connection.define('product',
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
                type: sequelize.STRING,
                unique: true
              },
              description: {
                allowNull: true,
                type: sequelize.STRING
              },
              image: {
                allowNull: true,
                type: sequelize.STRING
              },
              price: {
                type: sequelize.DECIMAL(30, 18),
                defaultValue: 0,
              },
              amount: {
                type: sequelize.INTEGER(),
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
          tableName: 'product'
        }
    );

    return productModel;

};