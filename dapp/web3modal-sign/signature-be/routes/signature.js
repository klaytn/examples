var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3();
const Caver = require('caver-js')
const caver = new Caver();

router.post('/verify', function(req, res) {
  try {
    const { address, message, signedMessage, provider } = req.body;
    let signedAddress;
    if(provider == "metamask") {
      signedAddress = web3.eth.accounts.recover(message, signedMessage);
    } else if(provider == "kaikas") {
      signedAddress = caver.klay.accounts.recover(message, signedMessage);
    }
    if(signedAddress.toLowerCase() === address.toLowerCase()) {
      res.status(200).json({success: true, message: 'Verification Success & Signed by '+signedAddress});
    } else {
      res.status(400).json({success: false, message: 'Not verified'});
    }
  } catch(err) {
    res.status(500).json({success: false, message: err.message});
  }
});

module.exports = router;
