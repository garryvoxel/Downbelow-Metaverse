const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let skillModel = connection.define('skill',
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
          description: {
            allowNull: false,
            type: sequelize.STRING
          },
          rarity: {
            allowNull: false,
            type: sequelize.STRING
          },
          ap: {
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
          characterId: {
            type: sequelize.UUID,
            references: {
              model: 'character',
              key: 'id'
            }
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
          tableName: 'skill'
        }
    );

    return skillModel;

};