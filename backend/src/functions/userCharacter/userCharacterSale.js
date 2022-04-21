'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const generateBaseStatus = require('../../providers/generateBaseStatus/generateBaseStatus');
const starterPacks = require('../../providers/starterPacks/starterPacks');
const user = require('../../models/user');
const character = require('../../models/character');
const userCharacter = require('../../models/userCharacter');
const userCharacterModel = userCharacter();
const characterModel = character();
const userModel = user();

module.exports.userCharacterSaleCreate = async (event) => {

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

    if(body.amount > 1){
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

    let filterCharacter = {where: {status: 1}};

    if(body.characterId === 'random'){
      filterCharacter.where.className = await generateBaseStatus.randomizeCharacter();
    }
    else{
      filterCharacter.where.id = body.characterId
    }

    let characterResult = await characterModel.findOne(filterCharacter);

    if(!characterResult){
      return returnMessage.generic(400, {
        message: 'Adventurer not found'
      });
    }

    characterResult.price = parseFloat(characterResult.price);

    let currentBalance = parseFloat(userResult.abyss);
    let priceCharacter = (body.characterId === 'random') ? characterResult.price : characterResult.price * 1.10;

    if(currentBalance < (priceCharacter * body.amount)){
      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }

    let starterPacksActive = await findStarterPacksActiveById('1');

    let listCharacter = [];

    for (var i = 0; i < body.amount; i++) {

      if(body.characterId === 'random'){
        characterResult.className = await generateBaseStatus.randomizeCharacter();
      }

      let newCharacter = await generateBaseStatus.generateBaseStatusPotential(starterPacksActive, characterResult.className);

      if(newCharacter){

        newCharacter.price = priceCharacter;

        listCharacter.push(newCharacter);
      
      }
    
    }

    let userCharacterSaleCreate = await createUserCharacter(userResult.id, listCharacter, transaction);

    if(userCharacterSaleCreate.length <= 0){
      return returnMessage.generic(400, {
        message: 'No general adventurer'
      });
    }

    let balanceUpdate = (currentBalance - parseFloat((priceCharacter * body.amount)));
    await userModel.update({abyss: balanceUpdate}, {where: {id: userResult.id}, transaction: transaction});
    
    await transaction.commit();
    
    return returnMessage.generic(201, userCharacterSaleCreate);
    
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function findStarterPacksActiveById(id) {

  let result = null;
  let findStarterPack = starterPacks.filter((item) => {
    return item.id === id;
  });
  
  if(findStarterPack.length > 0){
    result = findStarterPack[0];  
  }

  return result;

};

async function createUserCharacter(userId, list = [], transaction) {

  let listResult = [];

  try{

    if(list.length > 0){

      for (let i = 0; i < list.length; i++) {

        let userCharacter = {};

        userCharacter.rarity = list[i].name;
        userCharacter.price = list[i].price;  
        userCharacter.ap = list[i].ap;
        userCharacter.damage = list[i].characterResult.damage;  
        userCharacter.criticalChance = list[i].characterResult.criticalChance;  
        userCharacter.accuracy = list[i].characterResult.accuracy;  
        userCharacter.defense = list[i].characterResult.defense;  
        userCharacter.dodge = list[i].characterResult.dodge;  
        userCharacter.life = list[i].characterResult.life;  
        userCharacter.speed = list[i].characterResult.speed;  
        userCharacter.userId = userId;  
        userCharacter.characterId = list[i].characterResult.id;
        userCharacter.status = 1;

        let newUserCharacter = await userCharacterModel.create(userCharacter, {transaction: transaction});
        listResult.push({id: newUserCharacter.id, rarity: list[i].name, rarityLevelRandom: list[i].rarityLevelRandom });
      
      }

    }

  }
  catch(error){
    await transaction.rollback();
  }

  return listResult;

};