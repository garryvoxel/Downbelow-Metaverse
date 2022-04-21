const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const FreeHat = await hre.ethers.getContractFactory("ABYSS");
    const address = '0x08452576d1cd1f9420034f77fd4eccd62165bfa5';
    const free_hat_nftv1 = await FreeHat.attach(address);
    console.log("token uri TokenID(1): ", (await free_hat_nftv1.totalSupply()));
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});