const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    const VESTING = await hre.ethers.getContractFactory("ABYSSVesting");
    const vesting_address = '0x58f876857a02d6762e0101bb5c46a8c1ed44dc16';

    const vesting = await VESTING.attach(vesting_address);

    console.log("getCurrentTime=========>", (await vesting.getVestingSchedule(1)));
}

main()
.then(() => process.exit(0))
.catch((error) => {
  console.error(error);
  process.exit(1);
});