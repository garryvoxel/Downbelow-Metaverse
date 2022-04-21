const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let userCharacterWeaponModel = connection.define('userCharacterWeapon',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          userCharacterId: {
            type: sequelize.UUID,
            references: {
              model: 'userCharacter',
              key: 'id'
            }
          },
          userWeaponId: {
            type: sequelize.UUID,
            references: {
              model: 'userWeapon',
              key: 'id'
            }
          },
          weaponId: {
            type: sequelize.UUID,
            references: {
              model: 'weapon',
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
          tableName: 'userCharacterWeapon'
        }
    );

    return userCharacterWeaponModel;

};