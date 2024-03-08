# FeeDelegation on Baobab network
In order to Improve the usability of the blockchain, Klaytn has implemented on-chain fee delegation. It means that the service providers will be paying for the transaction fees on behalf of the users.

Klaytn-Dapp-Kit has the boiler plate code to implement fee delegation. More details on the Fee Delegation mechanism can be found here : https://medium.com/klaytn/klaytn-usability-improvement-series-3-fee-delegation-69b286c11968
![0_FsymS6h3grVDxHBv](https://user-images.githubusercontent.com/100742846/207226672-5cad2bcd-8d20-4480-a0c4-e2054ff41959.png)

This code has an example of deploying a contract without paying for the Txn as a user. It has 
	a) A UI where the user can sign the contract deployment and delegate the fee to admin
	b) A backend where the admin can pay for the transaction and execute. 

**UI**
An example smart contract, abi and bytecode are displayed in the screen. A deployer can connect to the wallet and sign the contract deployment transaction. 
**Backend**
Admin details are configured in the backend. The admin acts as a fee payer, signs the txn, pays for the txn and executes the txn to deploy the smart contract. 

Steps to run the application
`cd feedelegation`

Install nodejs v18 version or use nvm to manage node versions

1. **Setup Application**
    - `yarn install`
    - `cp .env.example .env` and update privatekey/publickey details of any account from metamask or kaikas wallet for fee payer containing test klay coins
    - `yarn start`
    - Open application in browser `http://localhost:3000`
3. Connect to Baobab testnet 
4. Sign the transaction from deployer address and delegate the fee to admin(fee payer) 
5. On Deploy, Admin who is the fee payer will deploy the contract by paying for the transaction.
