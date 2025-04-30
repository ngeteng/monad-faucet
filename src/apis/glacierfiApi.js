const axios = require("axios");
const {SocksProxyAgent} = require("socks-proxy-agent");
let headers = {
    accept: '*/*',
    'accept-language': 'en-US,en;q=0.9',
    connection: 'keep-alive',
    'content-type': 'application/json',
    origin: 'https://glacierfi.com',
    referer: 'https://glacierfi.com/',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'sec-ch-ua': '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"Windows"'
}
const url = "https://api.glacierfi.com/api"

async function exchangeToken(body, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }
    const response = await axios.post(
        `${url}/twitter/exchange-token`,
        body,
        { headers, httpsAgent }
        )
    if (response.status === 200) {
        return response.data.access_token
    }
}

async function authenticateToken(token, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }
    const response = await axios.post(
        `${url}/twitter/authenticate`,
        {token},
        { headers, httpsAgent }
    )
    if (response.status === 200 && response.data.success) {
        return response.data
    }
}

async function signature(body, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }

    const response = await axios.post(`${url}/signature`, body, {headers, httpsAgent})
    if (response.status === 200) {
        return response.data
    }
}

async function stakedRecently(address, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }

    const response = await axios.get(`${url}/staked-recently/${address}`, {headers, httpsAgent})
    if (response.status === 200) {
        return response.data.hasStakedRecently
    }
}

async function twitterFollowing(twitterUid, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }

    const response = await axios.get(`${url}/twitter/following/${twitterUid}`, {headers, httpsAgent})
    if (response.status === 200) {
        return response.data.status
    }
}

module.exports = {
    exchangeToken,
    authenticateToken,
    signature,
    stakedRecently,
    twitterFollowing
}