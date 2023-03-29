import { ethers } from "hardhat";

async function main() {
    const deployerAddr = "Your Metamask wallet address";

    const deployer = await ethers.getSigner(deployerAddr);

    console.log(`Deploying contracts with the account: ${deployer.address}`);
    console.log(`Account balance: ${(await deployer.getBalance()).toString()}`);

    const sbt = await ethers.getContractFactory("SoulBoundToken");

    const sbtContract = await sbt.deploy();

    await sbtContract.deployed();

    console.log(`Congratulations! You have just successfully deployed your soul bound tokens.`);
    console.log(`SBT contract address is ${sbtContract.address}. You can verify on https://baobab.scope.klaytn.com/account/${sbtContract.address}`);
}
// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});