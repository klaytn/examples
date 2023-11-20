# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a script that deploys that contract.

Try running some of the following tasks:

### Install

```bash
npm install
```

### Rename .env.sample
Change `.env.sample` to `.env`

### Deploy scripts
```bash
npx hardhat run scripts/sbtDeploy.js --network baobab
```

### Run Test

```bash
npx hardhat test test/sbtTest.js
```

### Hardhat Forking

```bash
npx hardhat node --fork <YOUR ARCHIVE NODE URL>
npx hardhat node --fork https://archive-en.cypress.klaytn.net
```