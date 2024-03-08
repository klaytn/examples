var express = require('express');
var router = express.Router();
const Caver = require('caver-js')
const RPC_URL = process.env.RPC_URL || "https://api.baobab.klaytn.net:8651";

router.post('/', async (req, res) => {
  try {
    const { deployTx } = req.body;

    const caver = new Caver(new Caver.providers.HttpProvider(RPC_URL, {}));
    if(!process.env.FEE_PAYER_PRIVATE_KEY) {
      throw new Error("Please configure fee payer private key");
    }
    // Feepayer keyring generation
    let feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY;
    let feePayerAddress = process.env.FEE_PAYER_PUBLIC_ADDRESS; //caver.klay.accounts.privateKeyToPublicKey(feePayerPrivateKey);

    const feePayerKeyring = caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey)
    caver.wallet.add(feePayerKeyring)

    let deployTxDecoded = caver.transaction.decode(deployTx);

    // Signs the transaction as a fee payer
    await caver.wallet.signAsFeePayer(feePayerKeyring.address, deployTxDecoded);

    // Transaction execution
    const receipt = await caver.rpc.klay.sendRawTransaction(deployTxDecoded);

    return res.status(200).json({success: true, contractAddress: receipt.contractAddress });

  } catch(err) {
    res.status(500).json({success: false, message: err.message});
  }
});

module.exports = router;
