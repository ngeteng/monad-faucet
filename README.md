## Monad Faucet CLI

Automate your daily testnet MON claims from GlacierFi on the Monad network with ease! This Node.js script authenticates via Twitter, stakes required tokens, and claims 0.5 MON per account every 24 hours.

---

### 🚀 Features

- **24/7 Automated Loop**: Runs indefinitely in a VPS environment, claiming tokens every 24 hours.
- **Multi-Account Support**: Process multiple wallet accounts sequentially from a JSON file.
- **Twitter Verification**: Verifies and auto-follows required GlacierFi Twitter account.
- **Auto-Staking**: Wraps and stakes ICE MON tokens before claiming.
- **Resilient Error Handling**: Catches exceptions per cycle to ensure continuous operation.

---

### 📋 Prerequisites

- Node.js v16+
- npm (Node Package Manager)
- A Twitter Bearer Token with necessary permissions
- Private keys for one or more Monad testnet wallets

---

### 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ngeteng/monad-faucet.git
   cd monad-faucet
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

---

### ⚙️ Configuration

1. Copy and edit `.env.example` to `.env`:
   ```ini
   TWITTER_BEARER_TOKEN=YOUR_TWITTER_TOKEN
   ```

2. Prepare your accounts file at `utils/accounts.json`:
   ```json
   [
     { "address": "0x...", "privateKey": "..." },
     { "address": "0x...", "privateKey": "..." }
   ]
   ```

---

### 🏃‍♂️ Usage

Start the script on your VPS (replace `0` with your account index):
```bash
node src/index.js 0
```
The script will loop indefinitely, waiting 24 hours between each claim cycle.

---

### 📂 File Structure

```
monad-faucet/
├── src/
│   └── index.js       # Entry point with 24/7 loop
├── utils/
│   ├── utils.js       # Read/write accounts
│   └── timeUtil.js    # Sleep function
├── services/
│   └── glacierfiService.js  # Claim and stake functions
├── contracts/
│   └── glacieFiContract.js  # Contract interactions
└── utils/
    └── accounts.json  # Wallet accounts to process
```

---

### ⚠️ Important Notes

- **Security**: Never share your private keys or Twitter tokens. Store them securely.
- **Compliance**: Use responsibly and abide by GlacierFi and Twitter's Terms of Service.
- **Testnet Only**: This script works on the Monad testnet. Do not use it on mainnet tokens.

---

### ❤️ Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you’d like to change.

---

### 📄 License

MIT © GlacierFi & Contributors

