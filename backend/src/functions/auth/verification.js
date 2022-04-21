'use strict';

const utility = require('../../helpers/utility');
const rolesList = require('../../providers/roles/rolesList');

module.exports.validate = async (event, context) => {

  try{

    const authorizationToken = utility.getAuthorizationToken(event);

    if(!authorizationToken) {
      return generatePolicy('undefined', 'Deny', event.methodArn);
    }

    let decodedJwt = utility.jwtDecode(authorizationToken);

    let rolesUser = await verifyGroupPermission(event.methodArn, decodedJwt);

    if(typeof decodedJwt.email !== 'undefined' && decodedJwt.email.length > 0 && rolesUser) {
      return generatePolicy(decodedJwt.email, 'Allow', event.methodArn);
    }
  
    return generatePolicy('undefined', 'Deny', event.methodArn);

  }
  catch(error){
    return generatePolicy('undefined', 'Deny', event.methodArn);
  }

};

async function verifyGroupPermission(methodArn, userJWT) {

  let response = false;

  try {
    
    let userType = userJWT;
    let userOne = {description: null};

    if(userType.typeUserId == '1'){
      userOne.description = 'System';
    }
    else if(userType.typeUserId == '2'){
      userOne.description = 'Player';
    }

    if(methodArn){

      let arnArray = methodArn.split(':')[5].split('/');

      let method = arnArray[2];
      let vApi = arnArray[3];
      let resource  = arnArray[4];
      
      let permissionType = `${method}:/${vApi}/${resource}`;

      let listRoles = rolesList[userOne.description];
  
      let permission = listRoles.filter((item) => {
          return item === permissionType;
      });
  
      if(permission.length > 0){
          response = true;
      }
  
    }

  } catch (error) {
    
  }

  return response;

};


const generatePolicy = function(principalId, effect, resource) {
  
  let authResponse = {};
  
  authResponse.principalId = principalId;
  
  if (effect && resource) {
    let policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    let statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = "*";
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }

  return authResponse;
};