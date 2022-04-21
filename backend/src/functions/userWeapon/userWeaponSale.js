'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const starterPacks = require('../../providers/starterPacks/starterPacks');
const user = require('../../models/user');
const weapon = require('../../models/weapon');
const userWeapon = require('../../models/userWeapon');
const character = require('../../models/character');
const generateBaseStatusPotential = require('../../providers/generateBaseStatus/generateBaseStatus');
const userWeaponModel = userWeapon();
const weaponModel = weapon();
const userModel = user();
const characterModel = character();

module.exports.userWeaponSaleCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { userId, characterId, amount } = body;

    if (!userId || !characterId || !amount) {

      return returnMessage.generic(400, {
        message: 'userId, adventurersId and amount are all required in the body',
      });
    
    }

    body.amount = parseInt(body.amount);

    if(body.amount > 99){
      return returnMessage.generic(400, {
        message: 'Purchase limit exceeded'
      });
    }

    if(body.amount <= 0){
      return returnMessage.generic(400, {
        message: 'Amount not allowed'
      });
    }
    
    if(resultUserDataSession.id != body.userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let userResult = await userModel.findOne({where: {id: body.userId, status: 1}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'User not found'
      });
    }

    let currentBalance = parseFloat(userResult.abyss);
    let listpriceWeapon = [];
    let listWeapon = [];
    let totalpriceWeapon = 0;

    for (var i = 0; i < body.amount; i++) {

      let starterPacksResult = starterPacks[0].rarity;
      let randomRarity = await generateBaseStatusPotential.randomizeRarityLevel(starterPacksResult);
      
      let characterIdQuery = null;

      if(body.characterId === 'random'){
        let randomCharacter = await generateBaseStatusPotential.randomizeCharacter();
        let characterResult = await characterModel.findOne({where: {className: randomCharacter}});
        characterIdQuery = characterResult.id;
      }
      else{
        characterIdQuery = body.characterId; 
      }
      
      let weaponResult = await weaponModel.findOne({where: {rarity: randomRarity.name, characterId: characterIdQuery, status: 1}});

      if(weaponResult){

        weaponResult.price = parseFloat(weaponResult.price);

        let priceWeapon = (body.characterId === 'random') ? weaponResult.price : weaponResult.price * 1.10;
        listpriceWeapon.push(parseFloat((priceWeapon * body.amount)));
        
        if(currentBalance >= priceWeapon){

          let apWeapon = await generateBaseStatusPotential.randomizeAPWeaponRarityLevel(randomRarity.name);
          let newWeapon = await createUserWeapon(userResult.id, apWeapon, weaponResult.id, weaponResult.price, transaction);
      
          if(newWeapon){

            listWeapon.push(newWeapon);
          
          }
          
        }
        
      }

    }

    totalpriceWeapon = utility.sumList(listpriceWeapon);

    if(currentBalance < totalpriceWeapon){
      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }

    if(listWeapon.length <= 0){
      return returnMessage.generic(400, {
        message: 'No general Weapon'
      });
    }

    let userWeaponSaleCreate = listWeapon;

    let balanceUpdate = (currentBalance - totalpriceWeapon);
    await userModel.update({abyss: balanceUpdate}, {where: {id: userResult.id}, transaction: transaction});
    
    await transaction.commit();
    
    return returnMessage.generic(201, userWeaponSaleCreate);

    
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function createUserWeapon(userId, apWeapon, weaponId, price, transaction) {

  let result = null;

  try{

    let userWeapon = {};
        
    userWeapon.ap = apWeapon;
    userWeapon.price = price;
    userWeapon.userId = userId;
    userWeapon.weaponId = weaponId;
    userWeapon.status = 1;

    let nWeapon = await userWeaponModel.create(userWeapon, {transaction: transaction});
    result = {id: nWeapon.id};

  }
  catch(error){
     
  }

  return result;

};