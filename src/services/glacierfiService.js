const {exchangeToken, authenticateToken, signature, stakedRecently, twitterFollowing} = require("../apis/glacierfiApi");
const {withdraw} = require("../contracts/glacieFiContract");
const {connectAndAuthorizeTwitter} = require("./twitterService");
const {callContract, approveTokenIfNeeded} = require("../utils/web3");
const {ethers} = require("ethers");
const {follow} = require("../apis/twitterApi");

async function getSignature(account, body) {
    const proxy = account.proxy
    if (!account.twitterKey) {
        const accessToken = await exchangeToken(body, proxy)
        const {twitterKey, userId} = await authenticateToken(accessToken, proxy)
        const isFollowing = await twitterFollowing(userId, proxy)

        await follow(account.twitterToken, proxy, "1779156687729139712")

        if (!isFollowing) {
            console.log("该推特账号尚未关注官方账号, 正在关注...")
            const userXId1 = "1885031541610266624"
            await follow(account.twitterToken, proxy, userXId1)
            console.log("关注成功")
        }
        account.twitterKey = twitterKey
    }

    const signatureBody = {
        "userAddress": account.address,
        "twitterKey": account.twitterKey
    };
    return await signature(signatureBody, proxy)
}

async function claimFaucet(wallet, account) {
    const body = await connectAndAuthorizeTwitter(account)
    body.redirect_uri = "https://glacierfi.com/faucet"
    const signatureRes = await getSignature(account, body)
    console.log(signatureRes)
    console.log("推特账号和stake条件已通过验证, 即将领水")
    await withdraw(wallet, signatureRes.nonce, signatureRes.deadline, signatureRes.signature, signatureRes.contractAddress)
    console.log(`${account.address}成功领取了0.5MON`)
}

async function wrapAndStakeIceMon(wallet, account) {
    const isStakedRecently = await stakedRecently(account.address, account.proxy)
    if (isStakedRecently) {
        return
    }
    console.log("24小时内没有在Glacierfi上stake过。正在完成stake mon操作来满足领水条件");
    await callContract(wallet, "0xceB564775415B524640D9f688278490A7f3EF9cd", "0.1", "0xd0e30db0")
    // await sleepRandomSeconds()
    await approveTokenIfNeeded(wallet, "0xceB564775415B524640D9f688278490A7f3EF9cd", ethers.parseEther("0.1"), "0x42A35134779159d60968A8b777B8a096dFFe8BeD")
    await callContract(wallet, "0x42A35134779159d60968A8b777B8a096dFFe8BeD", "0", "0x7b0472f00000000000000000000000000000000000000000000000000000000000000005000000000000000000000000000000000000000000000000016345785d8a0000")
    console.log("stake 0.1 iceMon成功")
}

module.exports = {
    claimFaucet,
    wrapAndStakeIceMon
}