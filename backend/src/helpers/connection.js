const sequelize = require('sequelize');

module.exports = function(){

    let connection = new sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
        host: process.env.DB_HOST,
        dialect: process.env.DB_DIALECT,
    });

    return connection;

};