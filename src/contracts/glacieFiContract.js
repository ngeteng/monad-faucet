const {ethers} = require("ethers");

const CONTRACT_ADDRESS = "0x54D5b6878974fd506c18f5c02A0788Fe65eF5Cb5"
const abi = [
    "function withdraw(uint256 nonce, uint256 deadline, bytes memory sig) external",
    "function isDeactivated() public view returns (bool)",
    "function getTimeUntilNextWithdrawal(address _address) view returns (uint256)",
    "function getBalance() external view returns (uint256)",
    "function cooldownPeriod() public view returns (uint256)"
];

async function withdraw(wallet, nonce, deadline, sig, contractAddress) {
    const contract = new ethers.Contract(contractAddress, abi, wallet);
    const tx = await contract.withdraw(nonce, deadline, sig);
    console.log("tx has been sent: ", tx.hash)
    const receipt = await tx.wait()
    console.log("tx confirmed successfully: ", receipt.hash)
}

async function getFaucetBalance(wallet) {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
    return ethers.formatEther(await contract.getBalance())
}

async function isDeactivated(wallet) {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
    const res = await contract.isDeactivated()
    console.log(res)
}

async function getTimeUntilNextWithdrawal(wallet) {
    const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
    return await contract.getTimeUntilNextWithdrawal(await wallet.getAddress())
}


module.exports = {
    withdraw,
    isDeactivated,
    getFaucetBalance,
    getTimeUntilNextWithdrawal,
}