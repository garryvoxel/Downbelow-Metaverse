'use strict';

const multiplier = 0.05;

module.exports.result = async function(apParty, baseChance, apRequirement){
    
    let resultRandom = false;
    let randomBaseChance = randomBase(0, 100);
    let result = (apParty - apRequirement);

    result = (result * multiplier);
    result = (result + baseChance);

    randomBaseChance = parseInt(randomBaseChance);
    result = parseInt(result);

    if(randomBaseChance <= result){
        resultRandom = true;    
    }
    
    return {
        resultRandom: resultRandom,
        randomBaseChance: randomBaseChance,
        result: result,
        apParty: apParty,
        baseChance: baseChance,
        apRequirement: apRequirement,
        multiplier: multiplier
    };

};

const randomBase = function(min, max) {
    
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;

};