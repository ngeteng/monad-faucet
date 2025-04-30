const axios = require('axios');
const {SocksProxyAgent} = require("socks-proxy-agent");

const url = "https://x.com/i/api/2/oauth2/authorize";
let params;
let headers;
let codeVerifier;

function generateCodeVerifier(length = 64) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const randomValues = new Uint8Array(64);
    crypto.getRandomValues(randomValues);
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters[randomValues[i] % characters.length];
    }
    return result.slice(0, length);
}

function generateCsrfToken() {
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);

    return Array.from(randomValues)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
}

const generatedCsrfToken = generateCsrfToken();

async function connectTwitter(twitterToken, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }

    codeVerifier = generateCodeVerifier();
    const state = generateCodeVerifier(32);

    const cookies = {
        ct0: generatedCsrfToken,
        auth_token: twitterToken
    };
    const cookiesHeaders = Object.entries(cookies)
        .map(([k, v]) => `${k}=${v}`)
        .join('; ');

    headers = {
        "cookie": cookiesHeaders,
        "x-csrf-token": generatedCsrfToken,
        "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
        "referer": "https://x.com/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        "x-twitter-auth-type": "OAuth2Session",
    };

    params = {
        response_type: "code",
        client_id: "SU43RHpwSEFBeVlqRVJHd0VZTks6MTpjaQ",
        redirect_uri: "https://glacierfi.com/faucet",
        scope: "tweet.read users.read",
        state: state,
        code_challenge: codeVerifier,
        code_challenge_method: "plain",
    };


    const resp = await axios.get(url, {
        headers,
        params,
        httpsAgent
    });

    if (resp.status !== 200) {
        return {success: false, error: `Failed to authorize: ${resp.status}`};
    }

    const authCode = resp.data.auth_code;
    if (!authCode) {
        return {success: false, error: "No auth_code found in Twitter authorize response"};
    }
    return {success: true, authCode}
}

async function authorizationTwitter(authCode, proxy) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }

    const approvalData = {
        approval: "true",
        code: authCode
    };

    const resp2 = await axios.post(url, approvalData, {
        headers: {
            ...headers,
            'content-type': 'application/x-www-form-urlencoded',
        },
        httpsAgent
    });

    if (resp2.status !== 200) {
        return {success: false, error: `Failed to approve authorization: ${resp2.status}`};
    }

    const redirectUrl = resp2.data.redirect_uri;
    if (!redirectUrl) {
        return {success: false, error: "No redirect_uri found after approval"};
    }


    const webHeaders = {
        "sec-ch-ua": '"Not(A:Brand";v="99", "Google Chrome";v="133", "Chromium";v="133"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "upgrade-insecure-requests": "1",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/133.0.0.0 Safari/537.36",
        "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "sec-fetch-site": "cross-site",
        "sec-fetch-mode": "navigate",
        "sec-fetch-user": "?1",
        "sec-fetch-dest": "document",
        "referer": "https://x.com/",
        "accept-language": "en-GB,en-US;q=0.9,en;q=0.8,ru;q=0.7,zh-TW;q=0.6,zh;q=0.5",
        "priority": "u=0, i",
    };

    await axios.get(redirectUrl, {
        headers: webHeaders,
        params,
        httpsAgent
    });

    return {
        success: true,
        data: {
            "code": authCode,
            "code_verifier": codeVerifier,
            "redirect_uri": redirectUrl
        }
    };
}

async function follow(twitterToken, proxy, userId) {
    let httpsAgent
    if (proxy != null && proxy !== "") {
        httpsAgent = new SocksProxyAgent(`${proxy}`)
    }

    try {
        // 定义请求的 URL 和参数
        const url = 'https://x.com/i/api/1.1/friendships/create.json';
        const params = new URLSearchParams({
            include_profile_interstitial_type: '1',
            include_blocking: '1',
            include_blocked_by: '1',
            include_followed_by: '1',
            include_want_retweets: '1',
            include_mute_edge: '1',
            include_can_dm: '1',
            include_can_media_tag: '1',
            include_ext_has_nft_avatar: '1',
            include_ext_is_blue_verified: '1',
            include_ext_verified_type: '1',
            include_ext_profile_image_shape: '1',
            skip_status: '1',
            user_id: userId,
        });

        // 设置请求头
        if (!headers) {
            const cookies = {
                ct0: generatedCsrfToken,
                auth_token: twitterToken
            };
            const cookiesHeaders = Object.entries(cookies)
                .map(([k, v]) => `${k}=${v}`)
                .join('; ');
            headers = {
                "cookie": cookiesHeaders,
                "x-csrf-token": generatedCsrfToken,
                "authorization": "Bearer AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs%3D1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA",
                "referer": "https://x.com/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
                "x-twitter-auth-type": "OAuth2Session",
            };
        } else {
             headers = {
                ...headers,
                'content-type': 'application/x-www-form-urlencoded',
            };
        }

        // 发起 POST 请求
        const response = await axios.post(url, params, { headers, httpsAgent });

        // 获取并返回响应中的 id
        if (response.status === 200 && response.data.id) {
            return {success: true}
        }
        return {success: false, error: `Failed to follow: ${response.status}`}

    } catch (error) {
        throw new Error(`Follow error: ${error.message}`);
    }
}

module.exports = {
    connectTwitter,
    authorizationTwitter,
    follow
}
