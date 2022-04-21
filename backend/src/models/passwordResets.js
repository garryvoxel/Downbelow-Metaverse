const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let passwordResetsModel = connection.define('passwordResets',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          email: {
            allowNull: false,
            type: sequelize.STRING,
            unique: true
          },
          token: {
            allowNull: false,
            type: sequelize.STRING
          },
          codeActive: {
            allowNull: true,
            type: sequelize.STRING
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
          tableName: 'passwordResets'
        }
    );

    return passwordResetsModel;

};