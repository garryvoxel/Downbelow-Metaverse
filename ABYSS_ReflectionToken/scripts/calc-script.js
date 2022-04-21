const hre = require("hardhat");

let card = {
    "token": {
        "_attack": 1,
        "_hornpower": 1,
        "_element": 'Forest'
    },
    "type_": {
        "_class": 1
    }
};

let boosterPrice = 1000;

function getBigNumber(value) {
    return hre.ethers.utils.parseEther(value.toString());
}

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    let aprob = [0.3315, 0.2, 0.15, 0.1, 0.08, 0.06, 0.04, 0.02, 0.01, 0.005, 0.0025, 0.001];
    let cprob = [0.33915, 0.2, 0.15, 0.1, 0.08, 0.06, 0.04, 0.02, 0.01, 0.0005, 0.00025, 0.0001];
    let hprob = [0.3, 0.2, 0.15, 0.1, 0.08, 0.06, 0.05, 0.03, 0.02, 0.01];
    let eprob = 0.01;

    if (card.token._element == 'Forest') eprob = 0.35;
    if (card.token._element == 'Water') eprob = 0.25;
    if (card.token._element == 'Fire') eprob = 0.2;
    if (card.token._element == 'Light') eprob = 0.15;
    if (card.token._element == 'Psiquic') eprob = 0.04;


    let bp = parseFloat(getBigNumber(boosterPrice));
//      let bp = 1000;


    let usdp = 0.015 * 27

    let _retVal = (((1.0 / (eprob * aprob[card.token._attack - 1] * hprob[card.token._hornpower - 1] * cprob[card.type_._class - 1])) * ((bp * usdp) / 3.0)) / 1000.0).toFixed(2);

    console.log("_retVal===>", _retVal);
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});

// 11435867512044112715
// 11435867512044111872