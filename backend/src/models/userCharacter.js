const sequelize = require('sequelize');
const sequelizePaginate = require('sequelize-paginate')
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let userCharacterModel = connection.define('userCharacter',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          rarity: {
            allowNull: false,
            type: sequelize.STRING
          },
          price: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          ap: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          damage: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          criticalChance: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          accuracy: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          defense: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          dodge: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          life: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          speed: {
            type: sequelize.FLOAT(),
            defaultValue: 0,
          },
          corruption: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          retired: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          isGenesis: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          userId: {
            type: sequelize.UUID,
            references: {
              model: 'user',
              key: 'id'
            }
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
          tableName: 'userCharacter'
        }
    );

    sequelizePaginate.paginate(userCharacterModel);

    return userCharacterModel;

};