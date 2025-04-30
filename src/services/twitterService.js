const {connectTwitter, authorizationTwitter } = require("../apis/twitterApi");

async function connectAndAuthorizeTwitter(account) {
    const twitterToken = account.twitterToken
    const proxy = account.proxy
    const connectRes = await connectTwitter(twitterToken, proxy)
    if (connectRes.success) {
        console.log("正在推特授权...")
        let res = await authorizationTwitter(connectRes.authCode, proxy);
        return res.data
    } else {
        console.log("Failed to connect to X: ", connectRes.error)
    }
}

module.exports = {
    connectAndAuthorizeTwitter
}