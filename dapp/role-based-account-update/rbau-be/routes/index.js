var express = require('express');
var router = express.Router();
const Caver = require('caver-js')
const RPC_URL = process.env.RPC_URL || "https://api.baobab.klaytn.net:8651";

let storedUserKeyring;

router.post('/register', async (req, res) => {
  try {
    const caver = new Caver(new Caver.providers.HttpProvider(RPC_URL, {}));
    if(!process.env.FEE_PAYER_PRIVATE_KEY) {
      throw new Error("Please configure fee payer private key");
    }
    if(!process.env.ACCOUNT_UPDATE_PRIVATE_KEY) {
      throw new Error("Please configure account update private key");
    }
    // Feepayer keyring generation
    let feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    let feePayerAddress = process.env.FEE_PAYER_PUBLIC_ADDRESS;
    const feePayerKeyring = caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey)

    // Accountupdate role keyring generation
    let accountUpdatePrivateKey = process.env.ACCOUNT_UPDATE_PRIVATE_KEY;
    let accountUpdateAddress = process.env.ACCOUNT_UPDATE_PUBLIC_ADDRESS;
    const accountUpdateKeyring = caver.wallet.keyring.create(accountUpdateAddress, accountUpdatePrivateKey)

    // transaction role keyring generation
    const userPrivateKey = caver.wallet.keyring.generateSingleKey();
    const userKeyring = caver.wallet.keyring.createFromPrivateKey(userPrivateKey)
    caver.wallet.add(userKeyring)

    const roleTransactionKeys = [userKeyring.key];
    const roleAccountUpdate = [accountUpdateKeyring.key];
    const roleFeePayer = [feePayerKeyring.key];
                        
    const newKeyring = caver.wallet.keyring.create(userKeyring.address, [
      roleTransactionKeys,
      roleAccountUpdate,
      roleFeePayer,
    ])

   
    const account = newKeyring.toAccount([
      {
        threshold: 1,
        weight: [1]
      },
      {
        threshold: 1,
        weight: [1]
      },
      {
        threshold: 1,
        weight: [1]
      },
    ])
    const accountUpdate = caver.transaction.feeDelegatedAccountUpdate.create({
      from: newKeyring.address,
      account,
      gas: 300000,
    })

    let signed = await caver.wallet.sign(newKeyring.address, accountUpdate)
    let rawTx = signed.getRawTransaction()

    // Fee payer signature
    caver.wallet.add(feePayerKeyring)
    let txDecoded = caver.transaction.decode(rawTx);
    signed = await caver.wallet.signAsFeePayer(feePayerKeyring.address, txDecoded)
    rawTx = signed.getRawTransaction()

    // send transaction by Fee payer
    const receipt = await caver.rpc.klay.sendRawTransaction(rawTx)

    caver.wallet.remove(userKeyring.address)
    caver.wallet.remove(feePayerKeyring.address)
    storedUserKeyring = newKeyring;

    return res.status(200).json({success: true, txnHash: receipt.transactionHash, userPubKey: newKeyring.address, userPrivKey: userKeyring.key.privateKey });

  } catch(err) {
    res.status(500).json({success: false, message: err.message});
  }
});

router.post('/updatePrivateKey', async (req, res) => {
  try {
    const caver = new Caver(new Caver.providers.HttpProvider(RPC_URL, {}));

    let feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    const feePayerKeyring = caver.wallet.keyring.create(storedUserKeyring.address, feePayerPrivateKey)

    let accountUpdatePrivateKey = process.env.ACCOUNT_UPDATE_PRIVATE_KEY;
    const accountUpdateKeyring = caver.wallet.keyring.create(storedUserKeyring.address, accountUpdatePrivateKey)

    caver.wallet.add(accountUpdateKeyring);

    const userPrivateKey = caver.wallet.keyring.generateSingleKey();
    const userKeyring = caver.wallet.keyring.createFromPrivateKey(userPrivateKey)

    const roleTransactionKeys = [userKeyring.key];
    const roleAccountUpdate = [accountUpdateKeyring.key];
    const roleFeePayer = [feePayerKeyring.key];
                        
    const newKeyring = caver.wallet.keyring.create(storedUserKeyring.address, [
      roleTransactionKeys,
      roleAccountUpdate,
      roleFeePayer,
    ])

   
    const account = newKeyring.toAccount([
      {
        threshold: 1,
        weight: [1]
      },
      {
        threshold: 1,
        weight: [1]
      },
      {
        threshold: 1,
        weight: [1]
      },
    ])
    const accountUpdate = caver.transaction.accountUpdate.create({
      from: newKeyring.address,
      account,
      gas: 300000,
    })

    let signed = await caver.wallet.sign(newKeyring.address, accountUpdate)
    let rawTx = signed.getRawTransaction()

    // send transaction by Fee payer
    const receipt = await caver.rpc.klay.sendRawTransaction(rawTx)

    caver.wallet.remove(accountUpdateKeyring.address)
    storedUserKeyring = newKeyring;

    return res.status(200).json({success: true, txnHash: receipt.transactionHash, userPubKey: newKeyring.address, userPrivKey: userKeyring.key.privateKey });

  } catch(err) {
    res.status(500).json({success: false, message: err.message});
  }
});

module.exports = router;
