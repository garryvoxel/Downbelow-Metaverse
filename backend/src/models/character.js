const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let characterModel = connection.define('character',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          className: {
            allowNull: false,
            type: sequelize.STRING
          },
          ap: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          damage: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          criticalChance: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          accuracy: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          defense: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          dodge: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          life: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          speed: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
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
          tableName: 'character'
        }
    );

    return characterModel;

};