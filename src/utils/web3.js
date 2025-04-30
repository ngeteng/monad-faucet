const {ethers} = require("ethers");
const {sleep} = require("./timeUtil");

const rpcUrl = "https://testnet-rpc.monad.xyz";

const PROVIDER = new ethers.JsonRpcProvider(rpcUrl);

async function callContract(wallet, contractAddress, value, input_data) {
    const tx = await wallet.sendTransaction({
        to: contractAddress,
        value: ethers.parseEther(value),
        data: input_data,
    })

    console.log("tx has been sent: ", tx.hash)
    const receipt = await tx.wait()
    console.log("tx confirmed successfully: ", receipt.hash)
    return receipt
}

async function approveTokenIfNeeded(wallet, tokenAddress, amount, spenderAddress) {
    const erc20ABI = [
        "function approve(address spender, uint256 amount) public returns (bool)",
        "function allowance(address owner, address spender) view returns (uint256)"
    ];
    const tokenContract = new ethers.Contract(tokenAddress, erc20ABI, wallet);
    const allowance = await tokenContract.allowance(wallet.address, spenderAddress);
    if (allowance < amount) {
        const tx = await tokenContract.approve(spenderAddress, ethers.MaxUint256);
        await tx.wait()
        await sleep(1000);
    }
}

module.exports = {
    PROVIDER,
    callContract,
    approveTokenIfNeeded
}