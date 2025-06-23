const { ethers } = require("hardhat");
async function testSync() {
  const provider1 = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const signer1 = provider1.getSigner(0);
  const tx = await signer1.sendTransaction({
    to: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    value: ethers.parseEther("1.0")
  });
  await tx.wait();
  console.log("Tx on node1:", tx.hash);

  const provider2 = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8546");
  const receipt = await provider2.getTransactionReceipt(tx.hash);
  console.log("Tx visible on node2:", receipt);
}
testSync().catch(console.error);