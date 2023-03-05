import { ethers } from "hardhat";

async function main() {
  const ThirdFund = await ethers.getContractFactory("ThirdFund");
  let thirdFund = await ThirdFund.deploy();
  thirdFund = await thirdFund.deployed();


  console.log(`ThirdFund ${thirdFund.address}`);
}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
