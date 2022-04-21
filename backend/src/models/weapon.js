const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let weaponModel = connection.define('weapon',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          name: {
            allowNull: true,
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
          damageBonus: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          price: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          characterId: {
            type: sequelize.UUID,
            references: {
              model: 'character',
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
          tableName: 'weapon'
        }
    );

    return weaponModel;

};