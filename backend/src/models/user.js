const sequelize = require('sequelize');
const connectionDB = require('../helpers/connection');

module.exports = function(){

    let connection = connectionDB();

    let userModel = connection.define('user',
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
          nike: {
            type: sequelize.STRING
          },
          email: {
            allowNull: false,
            type: sequelize.STRING,
            unique: true
          },
          password: {
            allowNull: false,
            type: sequelize.STRING
          },
          walletAddress: {
            allowNull: false,
            type: sequelize.STRING,
            unique: true
          },
          typeWallet: {
            type: sequelize.STRING
          },
          abyss: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          abyssUnclaimed: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          elvenSilver: {
            type: sequelize.DECIMAL(30, 18),
            defaultValue: 0,
          },
          rations: {
            type: sequelize.DOUBLE()
          },
          queenStone: {
            type: sequelize.DOUBLE()
          },
          arenaTickets: {
            type: sequelize.INTEGER(),
          },
          playedPvE: {
            type: sequelize.INTEGER(1),
            defaultValue: 0,
          },
          tokenApplication: {
            type: sequelize.STRING
          },
          refreshToken: {
            type: sequelize.STRING
          },
          activeToken: {
            type: sequelize.STRING
          },
          codeActive: {
            type: sequelize.STRING
          },
          dateCodeActive: {
            type: sequelize.DATE
          },
          status: {
            type: sequelize.INTEGER(2),
            defaultValue: 0,
          },
          typeUserId: {
            type: sequelize.UUID,
            references: {
              model: 'typeUser',
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
          tableName: 'user'
        }
    );

    return userModel;

};