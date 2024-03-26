const Caver = require('caver-js');

const caver = new Caver('https://public-en-baobab.klaytn.net/')

// https://toolkit.klaytn.foundation/account/accountKeyLegacy
const valueTransferAccountKeyLegacy = async () => {
    const keyRingData = {
        "_address": "<public key>",
        "_key": {
          "_privateKey": "<private key>"
        }
    };

    const privKey = keyRingData._key._privateKey;
    const keyring = caver.wallet.keyring.createFromPrivateKey(privKey)

    const senderAddress = keyring.address;
    const recipientAddress = keyring.address;
    const amount = 1;

    caver.wallet.add(keyring)
    const vt = caver.transaction.valueTransfer.create({
        from: senderAddress,
        to: recipientAddress,
        value: caver.utils.toPeb(amount, 'KLAY'),
        gas: 1000000,
    })
    const signed = await caver.wallet.sign(senderAddress, vt)
    const rawTx = signed.getRawTransaction()

    // Send the transaction
    const vtReceipt = await caver.rpc.klay.sendRawTransaction(rawTx)
    console.log(`Transaction Hash: ${vtReceipt.transactionHash}`);
}

const valueTransferAccountKeyPublic = async () => {
    const keyRingData = {
        "_address": "<public key>",
        "_key": {
          "_privateKey": "<private key>",
        }
    };

    const pubKey = keyRingData._address;
    const privKey = keyRingData._key._privateKey;

    const keyring = caver.wallet.keyring.create(pubKey, privKey);

    const senderAddress = keyring.address;
    const recipientAddress = keyring.address;
    const amount = 1;

    caver.wallet.add(keyring)
    const vt = caver.transaction.valueTransfer.create({
        from: senderAddress,
        to: recipientAddress,
        value: caver.utils.toPeb(amount, 'KLAY'),
        gas: 1000000,
    })
    const signed1 = await caver.wallet.sign(senderAddress, vt)
    const rawTx = signed1.getRawTransaction()

    // Send the transaction
    const vtReceipt = await caver.rpc.klay.sendRawTransaction(rawTx)
    console.log(`Transaction Hash: ${vtReceipt.transactionHash}`);
}

const valueTransferMultiSig = async () => {
    const keyRingData = {
        "_address": "<public key>",
        "_keys": [
          {
            "_privateKey": "<private key1>",
          },
          {
            "_privateKey": "<private key2>",
          }
        ]
    };

    let pubkey = keyRingData._address;

    const senderAddress = pubkey;
    const recipientAddress = pubkey;
    const amount = 1;

    // SIGNATURE 1
    let privkey = keyRingData._keys[0]._privateKey;
    let keyring = caver.wallet.keyring.create(pubkey, privkey)
    caver.wallet.add(keyring)
    let vt = caver.transaction.valueTransfer.create({
        from: senderAddress,
        to: recipientAddress,
        value: caver.utils.toPeb(amount, 'KLAY'),
        gas: 1000000,
    })
    let signed = await caver.wallet.sign(senderAddress, vt)
    let rawTx = signed.getRawTransaction()
    caver.wallet.remove(pubkey)

    // SIGNATURE 2
    let txDecoded = caver.transaction.decode(rawTx);
    privkey = keyRingData._keys[1]._privateKey;
    keyring = caver.wallet.keyring.create(pubkey, privkey);
    caver.wallet.add(keyring)
    signed = await caver.wallet.sign(senderAddress, txDecoded)
    rawTx = signed.getRawTransaction()

    // Send the transaction
    const vtReceipt = await caver.rpc.klay.sendRawTransaction(rawTx)
    console.log(`Transaction Hash: ${vtReceipt.transactionHash}`);
}

const valueTransferRoleBased = async () => {
    // [Transaction, AccountUpdate, FeePayer]
    const keyRingData = {
        "_address": "<public key>",
        "_keys": [
          [
            {
              "_privateKey": "<private key1>",
            }
          ],
          [
            {
              "_privateKey": "<private key2>",
            }
          ],
          [
            {
              "_privateKey": "<private key3>",
            }
          ]
        ]
    };

    let pubkey = keyRingData._address;

    const senderAddress = pubkey;
    const recipientAddress = pubkey;
    const amount = 1;

    // TRANSACTION ROLE SIGNATURE
    let privkey = keyRingData._keys[0][0]._privateKey;
    let keyring = caver.wallet.keyring.create(pubkey, privkey)
    caver.wallet.add(keyring)
    let vt = caver.transaction.valueTransfer.create({
        from: senderAddress,
        to: recipientAddress,
        value: caver.utils.toPeb(amount, 'KLAY'),
        gas: 1000000,
    })
    let signed = await caver.wallet.sign(senderAddress, vt)
    let rawTx = signed.getRawTransaction()
    caver.wallet.remove(keyring.address)

    // Send the transaction
    const vtReceipt = await caver.rpc.klay.sendRawTransaction(rawTx)
    console.log(`Transaction Hash: ${vtReceipt.transactionHash}`);
}

const valueTransferRoleBasedWithFeeDelgation = async () => {
    // [Transaction, AccountUpdate, FeePayer]
    const keyRingData = {
        "_address": "<public key>",
        "_keys": [
          [
            {
              "_privateKey": "<private key1>",
            }
          ],
          [
            {
              "_privateKey": "<private key2>",
            }
          ],
          [
            {
              "_privateKey": "<private key3>",
            }
          ]
        ]
    };

    let pubkey = keyRingData._address;
    let feePayerPubKey = "";

    const senderAddress = pubkey;
    const recipientAddress = pubkey;
    const amount = 1;

    // TRANSACTION ROLE SIGNATURE
    let privkey = keyRingData._keys[0][0]._privateKey;
    let keyring = caver.wallet.keyring.create(pubkey, privkey)
    caver.wallet.add(keyring)
    let vt = caver.transaction.feeDelegatedValueTransfer.create({
        from: senderAddress,
        to: recipientAddress,
        value: caver.utils.toPeb(amount, 'KLAY'),
        gas: 1000000,
    })
    let signed = await caver.wallet.sign(senderAddress, vt)
    let rawTx = signed.getRawTransaction()
    caver.wallet.remove(keyring.address)

    // FEE PAYER SIGNATURE
    privkey = keyRingData._keys[2][0]._privateKey;
    keyring = caver.wallet.keyring.create(feePayerPubKey || pubkey, privkey)
    caver.wallet.add(keyring)
    let txDecoded = caver.transaction.decode(rawTx);
    signed = await caver.wallet.signAsFeePayer(keyring.address, txDecoded)
    rawTx = signed.getRawTransaction()

    // Send the transaction
    const vtReceipt = await caver.rpc.klay.sendRawTransaction(rawTx)
    console.log(`Transaction Hash: ${vtReceipt.transactionHash}`);
}

// valueTransferAccountKeyLegacy();
// valueTransferAccountKeyPublic();
// valueTransferMultiSig();
// valueTransferRoleBased();
// valueTransferRoleBasedWithFeeDelgation();
