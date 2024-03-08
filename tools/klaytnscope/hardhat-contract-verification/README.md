# Klaytnscope Contract Verification Hardhat Project

This project demonstrates a basic Hardhat project contract verified on Klaytnscope. It comes with a sample contract, a test for that contract, and a script that deploys and verifies that contract on klaytnscope.

Try running some of the following tasks:

```shell
npm install
npx hardhat compile
export PRIVATE_KEY=<private_key_here_with_test_klay>
npx hardhat run scripts/deploy.js --network <network>
npx hardhat verify --network <network> <deployed_contract_address> <constructor_parameters>
```
