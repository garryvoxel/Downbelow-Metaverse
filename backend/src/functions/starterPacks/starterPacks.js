'use strict';
const returnMessage = require('../../helpers/returnMessage');
const starterPacks = require('../../providers/starterPacks/starterPacks');

module.exports.starterPacksShow = async (event) => {

  try {
    
    let listStarterPacks = starterPacks;
    
    return returnMessage.generic(200, listStarterPacks);
  
  } catch (error) {
    
    return returnMessage.generic(500, error);
  
  }
  
};