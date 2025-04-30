# Monad Faucet

## 📌 项目简介 / Project Overview
这是一个用于领取Monad网络测试代币MON的脚本。基于[GlacierFi](https://glacierfi.com/)项目, 通过自动stake 0.1MON和Twitter授权操作，从而领取每日的0.5 MON 代币奖励。

This is a Node.js script that **automates claiming MON test token from the [GlacierFi](https://glacierfi.com/) faucet**. It simulates a user flow by authorizing with Twitter and performing a staking action, enabling automated collection of 0.5 MON tokens daily.

## 预览 / Preview
![preview](./images/preview.jpeg)

## 🚀 功能特性 / Features

- 检查 Faucet 是否可领
- 自动执行 stake 操作以满足领取条件
- 自动检测 Twitter 是否关注官方账号并执行关注
- 自动调用合约领取 0.5 MON

- Checks if the faucet is ready to claim
- Stakes required tokens to meet claim conditions
- Verifies Twitter follow status and follows if needed
- Calls smart contracts to claim 0.5 MON

## 🛠️ 使用方法 / How to Use

1. 安装依赖 / Install dependencies:

```bash
npm install
```
2. 获取twitterToken  
在推特页面按F12进入开发者模式, 完成以下操作
![auth_toke](./images/auth_token.jpg)
3. 填写配置文件 / Prepare your config:
编辑 src/data/addresses.json文件
```json
[
  {
    "address": "EVM地址",
    "privateKey": "EVM私钥",
    "proxy": "ip代理，可以不填。格式username:password@ip:port",
    "twitterToken": "推特token"
  }
]
```
3. 执行脚本
```bashj
node src/index.js <index>
```
其中 <index> 是你想使用的账号在列表中的索引。  
Where <index> is the index of the account to use from your JSON file.