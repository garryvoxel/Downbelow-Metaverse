'use strict';
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const party = require('../../models/party');
const partyCharacter = require('../../models/partyCharacter');
const userCharacter = require('../../models/userCharacter');
const userCharacterSkill = require('../../models/userCharacterSkill');
const userCharacterWeapon = require('../../models/userCharacterWeapon');
const userWeapon = require('../../models/userWeapon');
const userSkill = require('../../models/userSkill');
const userParty = require('../../models/userParty'); 
const partyModel = party();
const partyCharacterModel = partyCharacter();
const userCharacterModel = userCharacter();
const userCharacterSkillModel = userCharacterSkill();
const userCharacterWeaponModel = userCharacterWeapon();
const userPartyModel = userParty();
const userWeaponModel = userWeapon();
const userSkillModel = userSkill();

module.exports.partyShow = async (event) => {

  try {

    partyModel.hasMany(partyCharacterModel, { foreignKey : 'partyId'});
    
    let listParty;
    let filter = { where: {status: 1}, limit: utility.totalRecordPagination() };
    let include = [
      { 
        model: partyCharacterModel, 
        as: 'partyCharacters', 
        where: {status: 1}, 
        required: false, 
      }
    ];
    
    filter.include = include;
    
    if(event.pathParameters){
      filter.where.id = event.pathParameters.id;
      listParty = await partyModel.findOne(filter);
    }
    else{
      listParty = await partyModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listParty);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.partyCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    
    const { description, userId, partyCharacters } = body;

    if (!description || !partyCharacters) {

      return returnMessage.generic(400, {
        message: 'description, userId and partyAdventurers are all required in the body',
      });
    
    }

    if(resultUserDataSession.id != userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let listUserCharacterId = utility.arrayColumn(partyCharacters, 'userCharacterId');

    if(listUserCharacterId.length > 4){
      return returnMessage.generic(400, {
        message: 'Number of adventurers not allowed'
      });
    }

    let totalPartyCharacter = await partyCharacterModel.count({where: {userCharacterId: listUserCharacterId, status: 1}});

    if(totalPartyCharacter > 0 && !body.id){
      return returnMessage.generic(400, {
        message: 'Adventurer already allocated in another party'
      });
    }

    if(body.id){
      
      let partyResult = await partyModel.findOne({where: {id: body.id}});
      if(partyResult){

        if(partyResult.exhausted == 1){
          return returnMessage.generic(400, {
            message: 'Exhausted partys cannot be edited'
          });
        }
        
        let validPartyContractActive = await utility.validPartyContractActive(partyResult.partyContractId);

        if(validPartyContractActive){
          return returnMessage.generic(400, {
            message: 'Change not allowed, partyContract active'
          });
        }

      }
      
    }

    let partyCreate = {};
    let apUserCharacters = await sumAp(body.userId, body.partyCharacters || []);

    body.ap = apUserCharacters;

    if(!body.id){

      body.status = 1;
      partyCreate = await partyModel.create(body, { transaction: transaction });
      await createUserParty(body.userId, partyCreate.id, transaction);

    }
    else{

      await partyModel.update(body, {where: {id: body.id}, transaction: transaction});

      if(body.status == 0){

        await userPartyModel.update({status: body.status}, {where: {partyId: body.id}, transaction: transaction});
        await partyCharacterModel.update({status: body.status}, {where: {partyId: body.id}, transaction: transaction});

      }

      partyCreate = body;

    }
    
    await createPartyCharacter(partyCreate.id, body.partyCharacters || [], transaction);

    await transaction.commit();

    if(body.id){

      let partyCharacterResult = await partyCharacterModel.findAll({attributes: ['userCharacterId'], where: {partyId: body.id, status: 1}});

      if(partyCharacterResult.length > 0){

        body.ap = await sumAp(body.userId, partyCharacterResult);
        await partyModel.update({ap: body.ap}, {where: {id: body.id}});
        partyCreate = body;

      }

    }

    return returnMessage.generic(201, partyCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.partyUpdatePartyAp = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    
    const { partyId, userId } = body;

    if (!partyId || !userId) {

      return returnMessage.generic(400, {
        message: 'partyId and userId are all required in the body',
      });
    
    }

    if(resultUserDataSession.id != body.userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let userPartyResult = await userPartyModel.findOne({where: {partyId: body.partyId, userId: body.userId, status: 1}});

    if(!userPartyResult){
      return returnMessage.generic(400, {
        message: 'User party not found'
      });
    }
    
    let listPartyCharacterResult = await partyCharacterModel.findAll({where: {partyId: body.partyId, status: 1}});

    if(listPartyCharacterResult.length != 4){
      return returnMessage.generic(400, {
        message: 'Number of adventurers not allowed'
      });
    }

    let partyUpdateAp = {};
    let apUserCharacters = await sumAp(body.userId, listPartyCharacterResult || []);

    partyUpdateAp.ap = apUserCharacters;
    
    await partyModel.update(partyUpdateAp, {where: {id: body.partyId}, transaction: transaction});
    
    await transaction.commit();

    return returnMessage.generic(200, partyUpdateAp);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function createPartyCharacter(partyId, list = [], transaction) {

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        let partyCharacter = {};
  
          if(!list[i].id){

            let partyCharacterResult = await partyCharacterModel.findOne({where: {userCharacterId: list[i].userCharacterId, status: 1}});
            
            if(!partyCharacterResult){

              partyCharacter.partyId = partyId;
              partyCharacter.userCharacterId = list[i].userCharacterId;
              partyCharacter.status = 1;

              await partyCharacterModel.create(partyCharacter, {transaction: transaction});

            }

          }
          else{

            partyCharacter = list[i];
            await partyCharacterModel.update(partyCharacter, {where: {id: list[i].id}, transaction: transaction});
          
          }
      }

    }

  }
  catch(error){
    
  }

};

async function createUserParty(userId, partyId, transaction) {

  let result = null;

  try{

    let userParty = {};
        
    userParty.userId = userId;
    userParty.partyId = partyId;
    userParty.status = 1;

    result = await userPartyModel.create(userParty, {transaction: transaction});
    
  }
  catch(error){
     
  }

  return result;

};

async function sumAp(userId, list = []) {

  let result = 0;
  let listApCharacter = [];
  let listApWeapon = [];
  let listApSkill = [];

  try{

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        let filterUserCharacter =  {
          attributes: ['id', 'ap'], 
          where: {id: list[i].userCharacterId, userId: userId, status: 1},
        };

        let userCharacterOne = await userCharacterModel.findOne(filterUserCharacter);
        
        if(userCharacterOne){
          
          listApCharacter.push(userCharacterOne.ap);

          userCharacterWeaponModel.belongsTo(userWeaponModel, { foreignKey : 'userWeaponId'});
          
          let filterUserCharacterWeapon = {
            where: {userCharacterId: userCharacterOne.id, status: 1},
            include: [{attributes: ['id', 'ap'], model: userWeaponModel, where: {status: 1}, required: false}]
          }

          let userCharacterWeapon = await userCharacterWeaponModel.findAll(filterUserCharacterWeapon);

          if(userCharacterWeapon.length > 0){

            for (var ii = 0; ii < userCharacterWeapon.length; ii++) {

              if(userCharacterWeapon[ii].userWeapon){
                listApWeapon.push(userCharacterWeapon[ii].userWeapon.ap);
              }

            }

          }

          userCharacterSkillModel.belongsTo(userSkillModel, { foreignKey : 'userSkillId'});

          let filterUserCharacterSkill = {
            where: {userCharacterId: userCharacterOne.id, status: 1},
            include: [{attributes: ['id', 'ap'], model: userSkillModel, where: {status: 1}, required: false}]
          }

          let userCharacterSkill = await userCharacterSkillModel.findAll(filterUserCharacterSkill);

          if(userCharacterSkill.length > 0){

            for (var iii = 0; iii < userCharacterSkill.length; iii++) {

              if(userCharacterSkill[iii].userSkill){
                listApSkill.push(userCharacterSkill[iii].userSkill.ap);
              }

            }

          }

        }

      }

      listApCharacter = utility.sumList(listApCharacter);
      listApWeapon = utility.sumList(listApWeapon);
      listApSkill = utility.sumList(listApSkill);

      result = (listApCharacter + listApWeapon + listApSkill);

    }

  }
  catch(error){
    
  }

  return result;

};
