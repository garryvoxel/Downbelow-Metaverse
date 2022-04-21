'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const web3 = require('../../helpers/web3');
const generateBaseStatus = require('../../providers/generateBaseStatus/generateBaseStatus');
const starterPacks = require('../../providers/starterPacks/starterPacks');
const user = require('../../models/user');
const skill = require('../../models/skill');
const weapon = require('../../models/weapon');
const userStarterPacks = require('../../models/userStarterPacks');
const userCharacter = require('../../models/userCharacter');
const userSkill = require('../../models/userSkill');
const userWeapon = require('../../models/userWeapon');
const whitelist = require('../../models/whitelist');
const purchaseWhitelist = require('../../models/purchaseWhitelist');
const whitelistModel = whitelist();
const userModel = user();
const userStarterPacksModel = userStarterPacks();
const userCharacterModel = userCharacter();
const skillModel = skill();
const weaponModel = weapon();
const userSkillModel = userSkill();
const userWeaponModel = userWeapon();
const purchaseWhitelistModel = purchaseWhitelist();

module.exports.generateBaseStatusShow = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    userStarterPacksModel.belongsTo(userModel, { foreignKey : 'userId'});
    userModel.hasMany(userCharacterModel, { foreignKey : 'userId'});
    userModel.hasMany(purchaseWhitelistModel, { foreignKey : 'userId'});
    
    let total = await utility.totalizerWhitelist();

    let listStarterPacks = {list: [], totalizer: total};
    let filter = { where: {status: 1} };
    let include = [
      { 
        model: userModel,
        attributes: ['id', 'name', 'walletAddress'], 
        where: {status: 1}, 
        required: false,
        include: [
          { 
            model: purchaseWhitelistModel,
            where: {status: 1}, 
            required: false 
          }
        ] 
      }
    ]

    filter.include = include;
    filter.where.userId = resultUserDataSession.id;
    listStarterPacks.list = await userStarterPacksModel.findAll(filter);

    listStarterPacks.list = await updateUserStarterPacks(listStarterPacks.list);

    listStarterPacks.totalizer.totalPurchaseStandardPack = total.totalPurchaseStandardPack;
    listStarterPacks.totalizer.totalPurchaseEpicPack = total.totalPurchaseEpicPack;
    
    return returnMessage.generic(200, listStarterPacks);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.generateBaseStatusCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  try {

    let total = await utility.totalizerWhitelist();

    let body = JSON.parse(event.body);

    const { walletAddress, starterPacksId, hashTransaction } = JSON.parse(event.body);

    if (!walletAddress || !starterPacksId || !hashTransaction) {
      return returnMessage.generic(400, {
        message: 'walletAddress, starterPacksId and hashTransaction are all required in the body',
      });
    
    }

    let hashPaymentExist = await userStarterPacksModel.findOne({where: {payment: hashTransaction}});

    if(hashPaymentExist){
      return returnMessage.generic(400, {
        message: 'Hash transaction not permission'
      });
    }

    let whitelistResult = await whitelistModel.findOne({where: {id: body.walletAddress}});

    if(!total.purchasePublic){

      if(!whitelistResult){
        return returnMessage.generic(400, {
          message: 'User not permission'
        });
      }

    }

    let userResult = await userModel.findOne({where: {walletAddress: body.walletAddress}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'User not found'
      });
    }

    if(resultUserDataSession.id != userResult.id){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let starterPacksActive = await findStarterPacksActiveById(body.starterPacksId);

    let verifyPurchaseStarterPacksUser = await verifyPurchaseStarterPacks(userResult, starterPacksActive);

    if(!total.purchasePublic){
      
      if(!verifyPurchaseStarterPacksUser){
        return returnMessage.generic(400, {
          message: 'Limit exceeded'
        });
      }
        
    }

    if(total.purchasePublic && total.totalPurchaseStandardPack > total.limitStandardPack && total.totalPurchaseEpicPack > total.limitEpicPack){
      return returnMessage.generic(400, {
        message: 'Sales are over'
      });
    }

    let result = await generateUserStarterPacks(userResult, starterPacksActive, body.hashTransaction);

    if(!result){
      return returnMessage.generic(400, {
        message: 'Error generating base status potential'
      });
    }

    return returnMessage.generic(200, result);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error);
  
  }
  
};

module.exports.generateUserCharacterSkillWeaponCreate = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);

    const { userId, userStarterPacksId } = JSON.parse(event.body);

    if (!userId || !userStarterPacksId) {
      return returnMessage.generic(400, {
        message: 'userId and userStarterPacksId are all required in the body',
      });
    
    }

    let userResult = await userModel.findOne({where: {id: body.userId}});

    if(!userResult){
      return returnMessage.generic(400, {
        message: 'User not found'
      });
    }

    if(resultUserDataSession.id != userResult.id){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    let userStarterPacksResult = await userStarterPacksModel.findOne({where: {id: body.userStarterPacksId, statusPayment: 1, status: 1}});

    if(!userStarterPacksResult){
      return returnMessage.generic(400, {
        message: 'UserStarterPacks not found'
      });
    }

    if(userStarterPacksResult.openPackage == 1){
      return returnMessage.generic(400, {
        message: 'UserStarterPacks has already been opened'
      });
    }

    let starterPacksActive = await findStarterPacksActiveById(userStarterPacksResult.starterPacksId);

    let newListUserCharacter = await generateUserCharacter(userResult, starterPacksActive, userStarterPacksResult, body.userStarterPacksId, transaction);

    if(newListUserCharacter.length <= 0){
      return returnMessage.generic(400, {
        message: 'Error generating base status potential'
      });
    }

    await userStarterPacksModel.update({openPackage: 1}, {where: {id: userStarterPacksResult.id}}, { transaction: transaction });

    await transaction.commit();

    return returnMessage.generic(200, {userStarterPacks: userStarterPacksResult, userCharacter: newListUserCharacter});
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error);
  
  }
  
};

async function generateUserStarterPacks(user, starterPacksActive, receiptTransaction) {

    const transaction = await utility.sequelizeTransaction();
    
    try{

      await createUserStarterPacks(user, starterPacksActive, receiptTransaction, transaction);
      
      await transaction.commit();
    
      return {starterPacks: starterPacksActive};

    }
    catch(error){
      await transaction.rollback();
    }
    
};

async function generateUserCharacter(user, starterPacksActive, userStarterPacksResult, userStarterPacksId, transaction) {

  let listCharacter = [];
  let listSkill = [];
  let listWeapon = [];

  try{

    for(let i=1; i <= userStarterPacksResult.amountCharacter; i++){

      let newCharacter = await generateBaseStatus.generateBaseStatusPotential(starterPacksActive);
      
      if(newCharacter){

        // Generate Skills
        listSkill = await generateSkillWeapon(user.id, "skill", newCharacter.characterResult, userStarterPacksResult.amountCharacter, userStarterPacksResult.amountSkills, starterPacksActive, transaction);
        newCharacter.userSkill = listSkill;  
        
        
        // Generate Weapon
        listWeapon = await generateSkillWeapon(user.id, "weapon", newCharacter.characterResult, userStarterPacksResult.amountCharacter, userStarterPacksResult.amountWeapon, starterPacksActive, transaction);
        newCharacter.userWeapon = listWeapon;
        
        listCharacter.push(newCharacter);

      }
      
    }

    // Generate Character
    await createUserCharacter(user.id, listCharacter, starterPacksActive.id, userStarterPacksId, transaction);

  }
  catch(error){
    await transaction.rollback();
  }

  return listCharacter;

};

async function verifyPurchaseStarterPacks(user, starterPacksActive) {

  let result = false;
  //let totalPurchase = await userStarterPacksModel.findAll({where: {userId: user.id, starterPacksId: starterPacksActive.id}});
  let totalPurchase = await purchaseWhitelistModel.findAll({where: {userId: user.id, starterPacksId: starterPacksActive.id}});

  if(totalPurchase.length < starterPacksActive.limit){
    result = true;
  }
  
  return result;

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

async function generateSkillWeapon(userId, type, character, amountCharacter, amount, starterPacksActive, transaction) {

  let list = [];

  try{
    
    amount = (amount / amountCharacter);

    if(type == 'skill'){

      for(let is=1; is<=amount; is++){

        let rarityRandomSkill = await generateBaseStatus.randomizeRarityLevel(starterPacksActive.rarity);
        
        //let listSkills = await skillModel.findAll({where: {characterId: character.id, rarity: rarityRandomSkill.name}});
        let listSkills = await skillModel.findAll({where: {characterId: character.id}});
        let countListSkills = listSkills.length;
        
        if(countListSkills > 0){
          let randomizeSkill = randomBase(0, countListSkills -1);
          let skill = listSkills[randomizeSkill];
          let apSkill = await generateBaseStatus.randomizeAPSkillRarityLevel(skill.rarity.toUpperCase());
          let newCreateUserSkill = await createUserSkill(userId, apSkill, skill.id, skill.price, starterPacksActive.id, rarityRandomSkill.name, transaction);
          list.push(newCreateUserSkill);
          
        }

      }

    }
    else if(type == 'weapon'){

      for(let iw=1; iw<=amount; iw++){

        let rarityRandomWeapon = await generateBaseStatus.randomizeRarityLevel(starterPacksActive.rarity);

        let listWeapon = await weaponModel.findAll({where: {characterId: character.id, rarity: rarityRandomWeapon.name}});
        let countListWeapon = listWeapon.length;

        if(countListWeapon > 0){
          let randomizeWeapon = randomBase(0, countListWeapon -1);
          let weapon = listWeapon[randomizeWeapon];
          let apWeapon = await generateBaseStatus.randomizeAPWeaponRarityLevel(weapon.rarity.toUpperCase());
          let newCreateUserWeapon = await createUserWeapon(userId, apWeapon, weapon.id, weapon.price, starterPacksActive.id, transaction);
          list.push(newCreateUserWeapon);
          
        }

      }

    }

  }
  catch(error){
    
  }

  return list;

};

async function createUserStarterPacks(user, starterPacks, hashTransaction, transaction) {

  try{

    let userStarterPacks = {};
        
    userStarterPacks.name = starterPacks.name;
    userStarterPacks.price = parseFloat(starterPacks.price);
    userStarterPacks.amountCharacter = starterPacks.amountCharacter;
    userStarterPacks.amountWeapon = starterPacks.amountWeapon;
    userStarterPacks.amountSkills = starterPacks.amountSkills;
    userStarterPacks.openPackage = 0;
    userStarterPacks.userId = user.id;
    userStarterPacks.starterPacksId = starterPacks.id;
    
    userStarterPacks.totalTransfer = 0;
    userStarterPacks.payment = hashTransaction;
    userStarterPacks.statusPayment = 0;

    userStarterPacks.walletAddress = user.walletAddress;
    userStarterPacks.giveAway = 0;
    

    userStarterPacks.status = 1;

    await userStarterPacksModel.create(userStarterPacks, {transaction: transaction});

    await purchaseWhitelistModel.create({total: 1, starterPacksId: starterPacks.id, userId: user.id, status: 1}, {transaction: transaction});
    

  }
  catch(error){
    await transaction.rollback(); 
  }

};

async function updateUserStarterPacks(listStarterPacks) {

  try{

    if(listStarterPacks.length > 0){

      for (var i = 0; i < listStarterPacks.length; i++) {
        
        if(listStarterPacks[i].statusPayment == 0){
          
          let starterPacksActive = await findStarterPacksActiveById(listStarterPacks[i].starterPacksId);

          if(starterPacksActive){

            let receiptTransactionReceipt = await web3.getTransactionReceipt(listStarterPacks[i].payment);
            
            if(receiptTransactionReceipt && receiptTransactionReceipt.status == true){

              let receiptTransaction = await web3.getTransaction(listStarterPacks[i].payment);

              if(receiptTransaction){

                if(parseFloat(receiptTransaction.value) >= starterPacksActive.price){
  
                  if(receiptTransaction.to.toUpperCase() == process.env.WALLET_ADDRESS_DOWN_BELOW.toUpperCase()){
                    
                    listStarterPacks[i].totalTransfer = parseFloat(receiptTransaction.value);
                    listStarterPacks[i].statusPayment = 1;
  
                    await userStarterPacksModel.update({totalTransfer: listStarterPacks[i].totalTransfer, statusPayment: listStarterPacks[i].statusPayment}, {where: {id: listStarterPacks[i].id}});
  
                    listStarterPacks[i] = listStarterPacks[i];
                    
                  }
  
                }
  
              }

            }

          }

        }

      }

    }

    return listStarterPacks;
    
  }
  catch(error){
    
  }

};

async function createUserCharacter(userId, list = [], starterPacksActiveId, userStarterPacksId, transaction) {

  try{

    if(list.length > 0){

      for (let i = 0; i < list.length; i++) {

        let userCharacter = {};

        userCharacter.rarity = list[i].name;
        userCharacter.price = 0;  
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
        userCharacter.isGenesis = (starterPacksActiveId == '2') ? 1 : 0;
        // userCharacter.userStarterPacksId = userStarterPacksId;
        userCharacter.status = 1;

        await userCharacterModel.create(userCharacter, {transaction: transaction});
      
      }

    }

  }
  catch(error){
    await transaction.rollback();
  }

};

async function createUserSkill(userId, apSkill, skillId, price, starterPacksActiveId, rarity, transaction) {

  let result = null;

  try{

    let userSkill = {};
        
    userSkill.ap = apSkill;
    userSkill.price = price;
    userSkill.rarity = rarity;
    userSkill.userId = userId;
    userSkill.skillId = skillId;
    userSkill.isGenesis = (starterPacksActiveId == '2') ? 1 : 0;
    userSkill.status = 1;

    result = await userSkillModel.create(userSkill, {transaction: transaction});

  }
  catch(error){
    await transaction.rollback();
  }

  return result;

};

async function createUserWeapon(userId, apWeapon, weaponId, price, starterPacksActiveId, transaction) {

  let result = null;

  try{

    let userWeapon = {};
        
    userWeapon.ap = apWeapon;
    userWeapon.price = price;
    userWeapon.userId = userId;
    userWeapon.weaponId = weaponId;
    userWeapon.isGenesis = (starterPacksActiveId == '2') ? 1 : 0;
    userWeapon.status = 1;

    result = await userWeaponModel.create(userWeapon, {transaction: transaction});

  }
  catch(error){
    await transaction.rollback(); 
  }

  return result;

};

const randomBase = function(min, max) {
    
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;

};