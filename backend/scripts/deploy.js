const hre = require("hardhat");

async function main() {
  const FileStorage = await hre.ethers.getContractFactory("FileStorage");
  const fileStorage = await FileStorage.deploy();
  await fileStorage.waitForDeployment();

  const address = await fileStorage.getAddress();
  console.log("FileStorage deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});