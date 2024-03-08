var express = require('express');
var router = express.Router();
var Web3 = require('web3');
var web3 = new Web3();
const Caver = require('caver-js')
const caver = new Caver();
let path = require('path');
const Low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const JWT_SECRET = process.env.JWT_SECRET || "ANY_SECRET_CODE_HERE";

// Use JSON file for storage
const file = path.join(process.cwd(), 'db.json')
const adapter = new FileSync(file)
const db = new Low(adapter)
const jwt = require("jsonwebtoken");

db.defaults({ users: [], count: 0 }).write()

router.post('/register', async (req, res) => {
  try {
    let {address} = req.body;
    let users = db.get('users');

    let userData = users.filter(
      user => user.address.toLowerCase() === address.toLowerCase()
    ).value();
    if(userData && userData.length > 0) {
      return res.status(200).json({success: true, message: 'User registered already'});
    } else {
      users.push({address: address, nonce: 0}).write();
      db.update('count', n => n + 1).write()
      return res.status(200).json({success: true, message: 'User registered successfully'});
    }
  } catch(err) {
    console.log(err);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
  
});

router.post('/nonce', (req, res) => {
  try {
    let users = db.get('users');
    let address = req.body.address || '';
  
    let userData = users.filter(
      user => user.address.toLowerCase() === address.toLowerCase()
    ).value();
    if(userData && userData.length ==  0) {
      return res.status(400).json({success: false, message: 'User not registered'});
    }
  
    let nonce = Math.floor(Math.random() * 1000000);
    users.find({address: address}).assign({nonce: nonce}).write();
    return res.status(200).json({success: true, data: {nonce: nonce}});
  } catch(err) {
    console.log(err);
    return res.status(500).json({success: false, message: 'Something went wrong'});
  }
});

router.post('/login', (req, res) => {
  let _address = req.body.address;
  let _signature = req.body.signature || '';
  let _provider = req.body.provider;

  let users = db.get('users');
  let userData = users.filter(
    user => user.address === _address
  ).value();
  if(userData && userData.length ==  0) {
    return res.status(400).json({success: false, message: 'User not registered'});
  }

  let _nonce = userData[0].nonce;
  let message = `Nonce : ${_nonce}`;
  let signedAddress;
  if(_provider == "metamask") {
    signedAddress = web3.eth.accounts.recover(message, _signature);
  } else if(_provider == "kaikas") {
    signedAddress = caver.klay.accounts.recover(message, _signature);
  }
  
  if(_address.toLowerCase() == signedAddress.toLowerCase()) {
    const token = jwt.sign({
        address: signedAddress
    }, JWT_SECRET, {expiresIn: '6h'});

    res.status(200).json({success: true, data: {token: token}, message: 'Verified'}); 
  } else {
    res.status(400).json({success: false, message: 'Not verified'});
  }
});

module.exports = router;
