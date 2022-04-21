const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let partyModel = connection.define('party',
        {
          id: {
            allowNull: false,
            primaryKey: true,
            type: sequelize.UUID,
            defaultValue: sequelize.UUIDV4,
            unique: true
          },
          description: {
            type: sequelize.STRING
          },
          ap: {
            type: sequelize.INTEGER(),
            defaultValue: 0,
          },
          exhausted: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          salary: {
            type: sequelize.DECIMAL(30, 18)
          },
          partyContractId: {
            type: sequelize.UUID,
            references: {
              model: 'partyContract',
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
          tableName: 'party'
        }
    );

    return partyModel;

};