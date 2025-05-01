const {readAccountsFromFile, saveAccountsToFile} = require("./utils/utils");
const {ethers} = require("ethers");
const {PROVIDER} = require("./utils/web3");
const {claimFaucet, wrapAndStakeIceMon} = require("./services/glacierfiService");
const { getFaucetBalance, getTimeUntilNextWithdrawal } = require("./contracts/glacieFiContract");
const {sleep} = require("./utils/timeUtil");

// Proses klaim untuk satu akun sesuai indeks dari argumen (tidak digunakan dalam loop)
async function main() {
  const accounts = await readAccountsFromFile();
  const target = parseInt(process.argv[2], 10);
  const account = accounts[target];
  const wallet = new ethers.Wallet(account.privateKey, PROVIDER);

  const faucetBalance = await getFaucetBalance(wallet);
  if (faucetBalance < 0.5) {
    console.log("Faucet余额不足，过段时间之后再试");
    process.exit(0);
  }

  console.log("==========================================================");
  console.log(`开始为地址: ${account.address}领水`);

  const remainingSeconds = await getTimeUntilNextWithdrawal(wallet);
  if (remainingSeconds > 0) {
    console.log(`需要等待${remainingSeconds}秒才能领水`);
    await sleep(Number(remainingSeconds) * 1000);
  }

  await wrapAndStakeIceMon(wallet, account);
  await claimFaucet(wallet, account);
  saveAccountsToFile(accounts);
}

// Loop 24/7: jalankan main() terus setiap 24 jam
async function mainLoop() {
  while (true) {
    try {
      console.log("🔄 Mulai proses klaim akun (indeks via ARGV, misal 0,1,...)");
      await main();
      console.log("✅ Selesai satu siklus klaim.");
    } catch (err) {
      console.error("❌ Error di main():", err);
    }
    console.log("⏲️ Menunggu 24 jam sebelum siklus berikutnya...");
    await sleep(24 * 60 * 60 * 1000);  // 24 jam dalam ms
  }
}

// Jalankan loop
mainLoop();
