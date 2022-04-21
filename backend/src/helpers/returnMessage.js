'use strict';

module.exports.headers = function(statusCode, body){

    return {
        statusCode: statusCode,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
          'Access-Control-Allow-Methods': 'OPTIONS, POST, PUT, GET, DELETE',
        },
        body: JSON.stringify(body)
      };

};

module.exports.generic = function(statusCode, body){

  return this.headers(statusCode, body);

};

module.exports.errorSql = function(statusCode, body){

  let bodyCustom = null;

  if(body){
    
    body.code = (body.code) ? body.code : null;
    body.errno = (body.errno) ? body.errno : null;
    body.sqlState = (body.sqlState) ? body.sqlState : null;
    body.sqlMessage = (body.sqlMessage) ? body.sqlMessage : null;
    body.parameters = (body.parameters) ? body.parameters : null;

    bodyCustom = {
      code: body.code, 
      errno: body.errno, 
      sqlState:body.sqlState, 
      sqlMessage: body.sqlMessage, 
      parameters: body.parameters
    };
  
  }

  return this.headers(statusCode, bodyCustom);

};