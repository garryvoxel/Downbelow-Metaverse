'use strict';

const sequelize  = require("sequelize");
const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const character = require('../../models/character');
const userCharacter = require('../../models/userCharacter');
const userCharacterSkill = require('../../models/userCharacterSkill');
const userCharacterWeapon = require('../../models/userCharacterWeapon');
const userSkill = require('../../models/userSkill');
const skill = require('../../models/skill');
const party = require('../../models/party');
const userWeapon = require('../../models/userWeapon');
const weapon = require('../../models/weapon');
const product = require('../../models/product');
const itemSale = require('../../models/itemSale');
const partyCharacter = require('../../models/partyCharacter');
const userCharacterModel = userCharacter();
const userCharacterSkillModel = userCharacterSkill();
const userCharacterWeaponModel = userCharacterWeapon();
const userSkillModel = userSkill();
const skillModel = skill();
const itemSaleModel = itemSale();
const productModel = product();
const userWeaponModel = userWeapon();
const weaponModel = weapon();
const characterModel = character();
const userModel = user();
const partyCharacterModel = partyCharacter();
const partyModel = party();


module.exports.userCharacterShow = async (event) => {

  try {

    const resultUserDataSession = utility.getUserDataSession(event);

    userCharacterSkillModel.belongsTo(skillModel, { foreignKey : 'skillId'});
    userCharacterModel.hasMany(userCharacterSkillModel, { foreignKey : 'userCharacterId'});

    userCharacterWeaponModel.belongsTo(weaponModel, { foreignKey : 'weaponId'});
    userCharacterModel.hasMany(userCharacterWeaponModel, { foreignKey : 'userCharacterId'});
    
    partyCharacterModel.belongsTo(partyModel, { foreignKey : 'partyId'});
    userCharacterModel.hasOne(partyCharacterModel, { foreignKey : 'userCharacterId'});
    userCharacterModel.belongsTo(characterModel, { foreignKey : 'characterId'});
    
    let listUserCharacter = [];
    let filter = { page: 2, paginate: utility.totalRecordPagination(), where: {status: 1}, order: [['createdAt', 'DESC']] };
    let include = [
      { model: characterModel, attributes: ['id', 'className', 'status'], where: {status: 1}, required: false },
      { model: partyCharacterModel, attributes: ['id'], where: {status: 1}, required: false, include: {model: partyModel, attributes: ['id', 'exhausted'], where: {status: 1}, required: false} },
      { model: userCharacterSkillModel, where: {status: 1}, required: false, include: {model: skillModel, as: 'skill', where: {status: 1}, required: false} },
      { model: userCharacterWeaponModel, where: {status: 1}, required: false, include: {model: weaponModel, as: 'weapon', where: {status: 1}, required: false} },
    ];

    filter.include = include;
    filter.where.userId = resultUserDataSession.id;
    
    if(event.pathParameters){

      filter.where.id = event.pathParameters.id;
      listUserCharacter = await userCharacterModel.findOne(filter);
    }
    else{
      listUserCharacter = await userCharacterModel.findAll(filter);
      //listUserCharacter = await utility.setPagination(userCharacterModel, filter);
    }
    
    return returnMessage.generic(200, listUserCharacter);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.userCharacterEquip = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    let userCharacterEquip = {};
    
    if(!body.userCharacterId){

      return returnMessage.generic(400, {
        message: 'userAdventurerId is required in the body'
      });

    }
    else{

      const userId = resultUserDataSession.id;

      let resultUserCharacter = await userCharacterModel.findOne({where: {id: body.userCharacterId, userId: userId, status: 1}});

      if(!resultUserCharacter){
        return returnMessage.generic(400, {
          message: 'userAdventurer not found'
        });
      }

      partyCharacterModel.belongsTo(partyModel, { foreignKey : 'partyId'});
      let resultPartyCharacter = await partyCharacterModel.findOne({where: {userCharacterId: body.userCharacterId, status: 1}, include: {model: partyModel, where: {status: 1}, required: false}});

      if(resultPartyCharacter){
        return returnMessage.generic(400, {
          message: 'Change not allowed, part linked to the adventurer'
        });
      }

      if(resultPartyCharacter){
        
        let validPartyContractActive = await utility.validPartyContractActive(resultPartyCharacter.party.partyContractId);
        
        if(validPartyContractActive){
          return returnMessage.generic(400, {
            message: 'Change not allowed, partyContract active'
          });
        }
      }
      
      userCharacterEquip = body;

      userCharacterEquip.userCharacterSkills = await createUserCharacterSkill(userCharacterEquip.userCharacterId, resultUserCharacter, body.userCharacterSkills || [], transaction);
      userCharacterEquip.userCharacterWeapons = await createUserCharacterWeapon(userCharacterEquip.userCharacterId, resultUserCharacter, body.userCharacterWeapons || [], transaction);

    }

    
    await transaction.commit();
    
    return returnMessage.generic(201, userCharacterEquip);
    
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.userCharacterRetire = async (event) => {

  return returnMessage.generic(400, {
    message: 'Maintenance'
  });

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { userId, userCharacterId } = body;

    if (!userId || !userCharacterId) {

      return returnMessage.generic(400, {
        message: 'userId and userAdventurerId are all required in the body',
      });
    
    }

    if(resultUserDataSession.id != userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    
    userCharacterModel.hasMany(userCharacterSkillModel, { foreignKey : 'userCharacterId'});
    userCharacterModel.hasMany(userCharacterWeaponModel, { foreignKey : 'userCharacterId'});

    userCharacterModel.belongsTo(userModel, { foreignKey : 'userId'});
    let resultUserCharacter = await userCharacterModel.findOne(
      {
        where: {id: body.userCharacterId, userId: userId, retired: 0, status: 1},
        include: [
          { model: userModel, attributes: ['id', 'abyss'], where: {status: 1}, required: false },
          { model: userCharacterSkillModel, where: {status: 1}, required: false },
          { model: userCharacterWeaponModel, where: {status: 1}, required: false }
        ]
      }
    );

    if(resultUserCharacter.userCharacterSkills.length > 0 || resultUserCharacter.userCharacterWeapons.length > 0){
      return returnMessage.generic(400, {
        message: "Cannot dismiss adventurer with weapon or skill equipped"
      });
    }

    if(!resultUserCharacter){
      return returnMessage.generic(400, {
        message: 'Adventurer not found'
      });
    }

    if(resultUserCharacter.isEquipped == 1){
      return returnMessage.generic(400, {
        message: 'Adventurer with weapons or skills equipped cannot be recycled or retired'
      });
    }

    partyCharacterModel.belongsTo(partyModel, { foreignKey : 'partyId'});
    let resultPartyCharacter = await partyCharacterModel.findOne({where: {userCharacterId: body.userCharacterId, status: 1}, include: {model: partyModel, where: {status: 1}, required: false}});

    if(resultPartyCharacter){
      return returnMessage.generic(400, {
        message: 'Change not allowed, adventurer is in a party'
      });
    }

    if(resultPartyCharacter){

      let validPartyContractActive = await utility.validPartyContractActive(resultPartyCharacter.party.partyContractId);

      if(validPartyContractActive){
        return returnMessage.generic(400, {
          message: 'Change not allowed, partyContract active'
        });
      }

    }

    let characterCreate = {};
    
    if(body.userCharacterId){

      await userCharacterModel.update({retired: 1, status: 0}, {where: {id: body.userCharacterId}, transaction: transaction});

      let reward = (resultUserCharacter.corruption == 60) ? 60 : (60 * 0.20);
      let currentBalance = parseFloat(resultUserCharacter.user.abyss);
      let balanceUpdate = (currentBalance + reward);

      await userModel.update({abyss: balanceUpdate}, {where: {id: resultUserCharacter.user.id}, transaction: transaction});

      resultUserCharacter.user.abyss = balanceUpdate;
      body.user =  resultUserCharacter.user;
      characterCreate = body;
      
    }
    
    await transaction.commit();
    
    return returnMessage.generic(201, characterCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

async function createUserCharacterSkill(userCharacterId, resultUserCharacter, list = [], transaction) {

  let listResultSkillEquipped = [];
  let listResultSkillUnequipped = [];
  let listResultSkillNotEvent = [];
  let balanceQueenStone = 0;

  try{

    let totalUserCharacterSkillEquipped = await userCharacterSkillModel.count({where: {userCharacterId: userCharacterId, status: 1}});
    let limitRarity = limitSkillWeapon(resultUserCharacter.rarity);

    let userBalanceQueenStone = await userModel.findOne({attributes: ['queenStone'], where: {id: resultUserCharacter.userId}});
    balanceQueenStone = parseFloat(userBalanceQueenStone.queenStone);

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        userSkillModel.belongsTo(userModel, { foreignKey : 'userId'});
        userSkillModel.belongsTo(skillModel, { foreignKey : 'skillId'});
        let resultSkillBelongsToClass = await userSkillModel.findOne(
          {
            where: {id: list[i].userSkillId, userId: resultUserCharacter.userId, status: 1},
            include: [
              {model: userModel, where: {status: 1}, required: false},
              {model: skillModel, as: 'skill', where: {status: 1}, required: false}
            ]
          }
        );

        if(!resultSkillBelongsToClass){
          listResultSkillNotEvent.push(list[i].userSkillId);
        }
        else if(resultSkillBelongsToClass.skill.characterId != resultUserCharacter.characterId){
          listResultSkillNotEvent.push(list[i].userSkillId);
        }
        else{

          let userCharacterSkill = {};
  
          if(!list[i].id){

            if(totalUserCharacterSkillEquipped < limitRarity.limitSkill){

              if(resultSkillBelongsToClass.isEquipped == 1){
                listResultSkillNotEvent.push(list[i].userSkillId);
              }
              else{
  
                userCharacterSkill.userCharacterId = userCharacterId;
                userCharacterSkill.userSkillId = list[i].userSkillId;
                userCharacterSkill.skillId = resultSkillBelongsToClass.skill.id;
                userCharacterSkill.status = 1;
  
                await userCharacterSkillModel.create(userCharacterSkill, {transaction: transaction});
                await userSkillModel.update({isEquipped: 1}, {where: {id: resultSkillBelongsToClass.id}, transaction: transaction});
                listResultSkillEquipped.push(list[i].userSkillId);
                totalUserCharacterSkillEquipped ++;
  
              }

            }

          }
          else{

            let existUserCharacterSkillUnequipped = await userCharacterSkillModel.findOne({attributes: ['id'], where: {userSkillId: list[i].userSkillId, status: 0}});

            if(!existUserCharacterSkillUnequipped){

              if(list[i].id){

                let itemSaleQueenStone = await itemSaleModel.findOne({where: {userId: resultSkillBelongsToClass.user.id, amount: sequelize.where(sequelize.col('amount'), '>', sequelize.col('amountSpent')), status: 1}, order: [['createdAt', 'ASC']], limit: 1});

                if(itemSaleQueenStone){
                
                  let stockQueenStone = await isStockQueenStone(resultSkillBelongsToClass.user.id, itemSaleQueenStone.id);
                
                  if(stockQueenStone.status){
                  
                    userCharacterSkill = {status: 0};
                    
                    await userCharacterSkillModel.destroy({where: {id: list[i].id}, transaction: transaction});
                    await userSkillModel.update({isEquipped: 0}, {where: {id: resultSkillBelongsToClass.id}, transaction: transaction});
                  
                    let amountSpent = (stockQueenStone.totalAmountSpent + 1);
                    let statusItem = (amountSpent === stockQueenStone.totalAmount) ? 0 : 1;
                    
                    
                    let updateBalanceQueenStone = (balanceQueenStone - 1);

                    await userModel.update({queenStone: updateBalanceQueenStone}, {where: {id: resultSkillBelongsToClass.user.id}, transaction: transaction});
                  
                    await itemSaleModel.update({amountSpent: amountSpent, status: statusItem}, {where: {id: itemSaleQueenStone.id}, transaction: transaction});
                    listResultSkillUnequipped.push(list[i].userSkillId);

                    balanceQueenStone = updateBalanceQueenStone;
                  
                  }
                
                }

              }
            
            }
            else{

              if(!list[i].id){

                    userCharacterSkill = {status: 1};
                    await userCharacterSkillModel.update(userCharacterSkill, {where: {id: existUserCharacterSkillUnequipped.id}, transaction: transaction});
                    await userSkillModel.update({isEquipped: 1}, {where: {id: resultSkillBelongsToClass.id}, transaction: transaction});
                    listResultSkillEquipped.push(list[i].userSkillId);

              }

            }

          }

        }
      }

    }

  }
  catch(error){

    
  }

  return {
    listResultSkillEquipped: listResultSkillEquipped,
    listResultSkillUnequipped: listResultSkillUnequipped,
    listResultSkillNotEvent: listResultSkillNotEvent
  }

};

async function createUserCharacterWeapon(userCharacterId, resultUserCharacter, list = [], transaction) {

  let listResultWeaponEquipped = [];
  let listResultWeaponUnequipped = [];
  let listResultWeaponNotEvent = [];

  try{

    let totalUserCharacterWeaponEquipped = await userCharacterWeaponModel.count({where: {userCharacterId: userCharacterId, status: 1}});
    let limitRarity = limitSkillWeapon(resultUserCharacter.rarity);

    if(list.length > 0){

      for (var i = 0; i < list.length; i++) {

        userWeaponModel.belongsTo(weaponModel, { foreignKey : 'weaponId'});
        let resultWeaponBelongsToClass = await userWeaponModel.findOne(
          {
            where: {id: list[i].userWeaponId, userId: resultUserCharacter.userId, status: 1},
            include: {model: weaponModel, as: 'weapon', where: {status: 1}, required: false}
          }
        );

        if(!resultWeaponBelongsToClass){
          listResultWeaponNotEvent.push(list[i].userWeaponId);
        }
        else if(resultWeaponBelongsToClass.weapon.characterId != resultUserCharacter.characterId){
          listResultSkillNotEvent.push(list[i].userSkillId);
        }
        
        else{

          let userCharacterWeapon = {};
  
          if(!list[i].id){

            if(totalUserCharacterWeaponEquipped < limitRarity.limitWeapon){

              if(resultWeaponBelongsToClass.isEquipped == 1){
                listResultWeaponNotEvent.push(list[i].userWeaponId);
              }
              else{
  
                userCharacterWeapon.userCharacterId = userCharacterId;
                userCharacterWeapon.userWeaponId = list[i].userWeaponId;
                userCharacterWeapon.weaponId = resultWeaponBelongsToClass.weapon.id;
                userCharacterWeapon.status = 1;
  
                await userCharacterWeaponModel.create(userCharacterWeapon, {transaction: transaction});
                await userWeaponModel.update({isEquipped: 1}, {where: {id: resultWeaponBelongsToClass.id}, transaction: transaction});
                listResultWeaponEquipped.push(list[i].userWeaponId);
                totalUserCharacterWeaponEquipped ++;
  
              }

            }

          }
          else{

            let existUserCharacterWeaponUnequipped = await userCharacterWeaponModel.findOne({attributes: ['id'], where: {userWeaponId: list[i].userWeaponId, status: 0}});

            if(!existUserCharacterWeaponUnequipped){

              if(list[i].id){

                userCharacterWeapon = {status: 0};
                
                await userCharacterWeaponModel.destroy({where: {id: list[i].id}, transaction: transaction});
                await userWeaponModel.update({isEquipped: 0}, {where: {id: resultWeaponBelongsToClass.id}, transaction: transaction});
                listResultWeaponUnequipped.push(list[i].userWeaponId);

              }

            }
            else{

              if(!list[i].id){

                userCharacterWeapon = {status: 1};
                await userCharacterWeaponModel.update(userCharacterWeapon, {where: {id: existUserCharacterWeaponUnequipped.id}, transaction: transaction});
                await userWeaponModel.update({isEquipped: 1}, {where: {id: resultWeaponBelongsToClass.id}, transaction: transaction});
                listResultWeaponEquipped.push(list[i].userWeaponId);

              }
              
            }

          }

        }
      }

    }

  }
  catch(error){
    
  }

  return {
    listResultWeaponEquipped: listResultWeaponEquipped,
    listResultWeaponUnequipped: listResultWeaponUnequipped,
    listResultWeaponNotEvent: listResultWeaponNotEvent
  }

};

const isStockQueenStone = async function(userId, itemSaleId){

  let result = {totalAmount: 0, totalAmountSpent: 0, productId: null, status: false};

  try{

    let resultProduct = await productModel.findOne({where: {name: 'Queen Stone', status: 1}, limit: 1});

    if(resultProduct){

      let resultAmountItemSale = await itemSaleModel.sum(
        'amount',
        { where: {id: itemSaleId, userId: userId, status: 1}}
      );

      let resultAmountSpentItemSale = await itemSaleModel.sum(
        'amountSpent',
        { where: {id: itemSaleId, userId: userId, status: 1}}
      );

      if(resultAmountItemSale > 0){
        result.totalAmount = resultAmountItemSale;
        result.totalAmountSpent = resultAmountSpentItemSale;
        result.productId = resultProduct.id; 
        result.status = true;
      }

    }

  }
  catch(error){
    
  }

  return result;

};

const limitSkillWeapon = function(name = null) {
  
  let result = null;

  let listRarity = [
    {name: 'COMMON', limitSkill: 2, limitWeapon: 1},
    {name: 'RARE', limitSkill: 2, limitWeapon: 1},
    {name: 'EPIC', limitSkill: 3, limitWeapon: 1},
    {name: 'LEGENDARY', limitSkill: 3, limitWeapon: 1},
    {name: 'MYTHIC', limitSkill: 4, limitWeapon: 1},
    {name: 'GODLIKE', limitSkill: 4, limitWeapon: 1},
  ];

  if(name){

    let searchRarity = listRarity.filter((item) => {
      return item.name === name;
    });

    if(searchRarity.length > 0){
      result = searchRarity[0];
    }

  }
  
  return result

};