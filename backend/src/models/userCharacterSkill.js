const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let userCharacterSkillModel = connection.define('userCharacterSkill',
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
          userSkillId: {
            type: sequelize.UUID,
            references: {
              model: 'userSkill',
              key: 'id'
            }
          },
          skillId: {
            type: sequelize.UUID,
            references: {
              model: 'skill',
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
          tableName: 'userCharacterSkill'
        }
    );

    return userCharacterSkillModel;

};