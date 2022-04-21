const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let partyCharacterModel = connection.define('partyCharacter',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          partyId: {
            type: sequelize.UUID,
            references: {
              model: 'party',
              key: 'id'
            }
          },
          userCharacterId: {
            allowNull: true,
            type: sequelize.UUID,
            defaultValue: null,
            references: {
              model: 'userCharacter',
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
          tableName: 'partyCharacter'
        }
    );

    return partyCharacterModel;

};