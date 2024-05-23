var express = require('express');
var router = express.Router();
const Caver = require('caver-js')
const RPC_URL = process.env.RPC_URL || "https://api.baobab.klaytn.net:8651";

router.post('/', async (req, res) => {
  const caver = new Caver(new Caver.providers.HttpProvider(RPC_URL, {}));
  let feePayerPrivateKey = process.env.FEE_PAYER_PRIVATE_KEY || "";
  let feePayerAddress = process.env.FEE_PAYER_PUBLIC_ADDRESS || "";

  try {
    if (req.body == "" && req.method != "POST") return;

    const { deployTx } = req.body;

    // Feepayer keyring generation
    if (!feePayerPrivateKey) throw new Error("configure fee payer private key");

    if (!feePayerAddress) throw new Error("fee payer address: null");

    const feePayerKeyring = caver.wallet.keyring.create(feePayerAddress, feePayerPrivateKey)
    caver.wallet.add(feePayerKeyring)

    const { deployTxDecoded } = caver.transaction.decode(deployTx);
    if (deployTxDecoded.type != "TxTypeSmartContractDeploy") return

    // Signs the transaction as a fee payer
    await caver.wallet.signAsFeePayer(feePayerKeyring.address, deployTxDecoded);

    // Transaction execution
    const receipt = await caver.rpc.klay.sendRawTransaction(deployTxDecoded);

    return res.status(200).json({ success: true, contractAddress: receipt.contractAddress });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
