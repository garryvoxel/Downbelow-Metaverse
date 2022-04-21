const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let floorModel = connection.define('floor',
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
            type: sequelize.STRING,
            unique: true
          },
          number: {
            allowNull: true,
            type: sequelize.STRING
          },
          apRequirement: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          baseChance: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          elvenSilver: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          rewards: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          provisionRequirement: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          contract1Day: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          contract7Day: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          typePartyContractId: {
            type: sequelize.UUID,
            references: {
              model: 'typePartyContract',
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
          tableName: 'floor'
        }
    );

    return floorModel;

};