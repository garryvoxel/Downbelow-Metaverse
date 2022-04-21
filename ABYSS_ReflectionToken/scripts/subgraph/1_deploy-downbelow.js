const hre = require("hardhat");
async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // We get the contract to deploy
    const Downbelow = await hre.ethers.getContractFactory("Downbelow");

    const downbelow = await Downbelow.deploy(
        "0x17B0a6625ebF4aB47EB254A2d0D0F1B93A30c57d",  //token
        "0x6623251447ab7afeB0442Aa1Ed4D48FD6Eeb55Fa",  //signer
        "0x2A2c1b6f2Be8eD53626F1d0578EDb6010E9C52fe",  //depositPoolWallet
        "0xB4f175366754ea17dDdA73A96b476bAbfD18Ad5D"  //withdrawPoolWallet
    );

    await downbelow.deployed();
    console.log("Downbelow deployed to:", downbelow.address);
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});