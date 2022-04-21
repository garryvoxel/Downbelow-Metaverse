'use strict';

const returnMessage = require('../../helpers/returnMessage');
const utility = require('../../helpers/utility');
const user = require('../../models/user');
const userSkill = require('../../models/userSkill');
const skill = require('../../models/skill');
const character = require('../../models/character');
const characterModel = character();
const userSkillModel = userSkill();
const skillModel = skill();
const userModel = user();

module.exports.userSkillShow = async (event) => {

  try {

    const resultUserDataSession = utility.getUserDataSession(event);

    skillModel.belongsTo(characterModel, { foreignKey : 'characterId'});
    userSkillModel.belongsTo(skillModel, { foreignKey : 'skillId'});
    
    let listUserSkill = [];
    let filter = { where: {status: 1}, order: [['createdAt', 'DESC']] };
    let include = [
      { 
        model: skillModel, 
        attributes: ['id', 'name', 'description', 'status'], 
        where: {status: 1}, 
        required: false,
        include: {  model: characterModel, attributes: ['id'], where: {status: 1}, required: false } 
      },
    ];

    filter.include = include;
    filter.where.userId = resultUserDataSession.id;
    if(event.pathParameters){

      filter.where.id = event.pathParameters.id;
      listUserSkill = await userSkillModel.findOne(filter);

    }
    else{
      listUserSkill = await userSkillModel.findAll(filter);
    }
    
    return returnMessage.generic(200, listUserSkill);
  
  } catch (error) {
    
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};

module.exports.userSkillRetire = async (event) => {

  const resultUserDataSession = utility.getUserDataSession(event);

  const transaction = await utility.sequelizeTransaction();

  try {

    let body = JSON.parse(event.body);
    const { userId, userSkillId } = body;

    if (!userId || !userSkillId) {

      return returnMessage.generic(400, {
        message: 'userId and userSkillId are all required in the body',
      });
    
    }

    if(resultUserDataSession.id != body.userId){
      return returnMessage.generic(400, {
        message: 'User not allowed'
      });
    }

    userSkillModel.belongsTo(userModel, { foreignKey : 'userId'});
    let resultUserSkill = await userSkillModel.findOne(
      {
        where: {id: body.userSkillId, userId: body.userId, retired: 0, status: 1},
        include: {model: userModel, attributes: ['id', 'abyss'], where: {status: 1}, required: false}
      }
    );

    if(!resultUserSkill){
      return returnMessage.generic(400, {
        message: 'Skill not found'
      });
    }

    if(resultUserSkill.isEquipped == 1){
      return returnMessage.generic(400, {
        message: 'Equipped items cannot be recycled'
      });
    }

    let skillCreate = {};
    
    if(body.userSkillId){

      await userSkillModel.update({retired: 1, status: 0}, {where: {id: body.userSkillId}, transaction: transaction});

      let reward = (resultUserSkill.corruption == 60) ? 60 : (30 * 0.10);
      let currentBalance = parseFloat(resultUserSkill.user.abyss);
      let balanceUpdate = (currentBalance + reward);

      await userModel.update({abyss: balanceUpdate}, {where: {id: resultUserSkill.user.id}, transaction: transaction});

      resultUserSkill.user.abyss = balanceUpdate;
      body.user =  resultUserSkill.user;
      skillCreate = body;
      
    }
    
    await transaction.commit();
    
    return returnMessage.generic(201, skillCreate);
  
  } catch (error) {
    
    await transaction.rollback();
    return returnMessage.errorSql(500, error.parent);
  
  }
  
};