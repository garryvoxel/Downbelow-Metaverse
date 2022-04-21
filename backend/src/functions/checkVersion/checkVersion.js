'use strict';

const returnMessage = require('../../helpers/returnMessage');

module.exports.checkVersionShow = async (event) => {

  try {

    let currentVersion = '1.0.0';

    if(!event.pathParameters.id){

      return returnMessage.generic(400, {
        message: 'Version and mandatory',
      });

    }

    if(currentVersion != event.pathParameters.id){
      return returnMessage.generic(400, {
        message: 'Incompatible version',
      });
    }
    
    return returnMessage.generic(200, {currentVersion: currentVersion});
    
  
  } catch (error) {
    
    return returnMessage.generic(500, error);
  
  }
  
};
