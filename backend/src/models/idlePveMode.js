const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let idlePveModeModel = connection.define('idlePveMode',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          resultRandom: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          randomBaseChance: {
            type: sequelize.DOUBLE(),
            defaultValue: 0,
          },
          result: {
            type: sequelize.DOUBLE(),
            defaultValue: 0,
          },
          apParty: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          baseChance: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          apRequirement: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          multiplier: {
            type: sequelize.DOUBLE(),
            defaultValue: 0,
          },
          rewards: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          elvenSilver: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          status: {
            type: sequelize.INTEGER(2),
            defaultValue: 0,
          },
          userId: {
            type: sequelize.UUID,
            references: {
              model: 'user',
              key: 'id'
            }
          },
          floorId: {
            type: sequelize.UUID,
            references: {
              model: 'floor',
              key: 'id'
            }
          },
          partyId: {
            type: sequelize.UUID,
            references: {
              model: 'party',
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
          tableName: 'idlePveMode'
        }
    );

    return idlePveModeModel;

};