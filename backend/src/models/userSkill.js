const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let userSkillModel = connection.define('userSkill',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          ap: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          price: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          rarity: {
            allowNull: true,
            type: sequelize.STRING
          },
          isEquipped: {
            type: sequelize.INTEGER(1),
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
          tableName: 'userSkill'
        }
    );

    return userSkillModel;

};