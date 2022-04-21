'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const starterPacks = require('../../providers/starterPacks/starterPacks');
const user = require('../../models/user');
const skill = require('../../models/skill');
const userSkill = require('../../models/userSkill');
const character = require('../../models/character');
const generateBaseStatusPotential = require('../../providers/generateBaseStatus/generateBaseStatus');
const userSkillModel = userSkill();
const skillModel = skill();
const userModel = user();
const characterModel = character();

module.exports.userSkillSaleCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { userId, characterId, amount } = body;

    if (!userId || !characterId || !amount) {

      return returnMessage.generic(400, {
        message: 'userId, adventurerId and amount are all required in the body',
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
    let listpriceSkill = [];
    let listSkill = [];
    let totalpriceSkill = 0;

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
      
      //let skillResult = await skillModel.findAll({where: {rarity: randomRarity.name, characterId: characterIdQuery, status: 1}});
      let skillResult = await skillModel.findAll({where: {characterId: characterIdQuery, status: 1}});

      let randomClass = randomBase(0, skillResult.length);
      skillResult = skillResult[randomClass];

      if(skillResult){

        skillResult.price = parseFloat(skillResult.price);

        let priceSkill = (body.characterId === 'random') ? skillResult.price : skillResult.price * 1.10;
        listpriceSkill.push(parseFloat((priceSkill * body.amount)));
        
        if(currentBalance >= priceSkill){

          let apSkill = await generateBaseStatusPotential.randomizeAPSkillRarityLevel(randomRarity.name);
          let newSkill = await createUserSkill(userResult.id, apSkill, skillResult.id, skillResult.price, randomRarity.name, transaction);
      
          if(newSkill){

            listSkill.push(newSkill);
          
          }
          
        }
        
      }

    }

    totalpriceSkill = utility.sumList(listpriceSkill);

    if(currentBalance < totalpriceSkill){
      return returnMessage.generic(400, {
        message: 'Insufficient balance'
      });
    }

    if(listSkill.length <= 0){
      return returnMessage.generic(400, {
        message: 'No general Skill'
      });
    }

    let userSkillSaleCreate = listSkill;

    let balanceUpdate = (currentBalance - totalpriceSkill);
    await userModel.update({abyss: balanceUpdate}, {where: {id: userResult.id}, transaction: transaction});
    
    await transaction.commit();
    
    return returnMessage.generic(201, userSkillSaleCreate);

    
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function createUserSkill(userId, apSkill, skillId, price, rarity, transaction) {

  let result = null;

  try{

    let userSkill = {};
        
    userSkill.ap = apSkill;
    userSkill.price = price;
    userSkill.rarity = rarity;
    userSkill.userId = userId;
    userSkill.skillId = skillId;
    userSkill.status = 1;

    let nUserSkill = await userSkillModel.create(userSkill, {transaction: transaction});
    result = {id: nUserSkill.id};

  }
  catch(error){
     
  }

  return result;

};

const randomBase = function(min, max) {
    
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;

};