const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let typeUserModel = connection.define('typeUser',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          description: {
            allowNull: false,
            type: sequelize.STRING
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
          tableName: 'typeUser'
        }
    );

    return typeUserModel;

};