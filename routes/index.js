var express = require('express');
var router = express.Router();
let db = require('../models');
let MessageUpdate = require('../methods/MessageUpdate');
let NewMessage = require('../methods/NewMessage');
let NewChat = require('../methods/NewChat');
let UserUnfollow = require('../methods/UserUnfollow');
let UserFollow = require('../methods/UserFollow');

NewMessage.prototype.hellowWorld = async function(){
  await this.sendMessage('Hello world');
  return 'hi'
};

NewMessage.prototype.secondMessage = async function(){
  await this.sendMessage('secondMessage')
};

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let eventList = {
  'message/new': NewMessage,
  'message/update': MessageUpdate,
  'user/follow': UserFollow,
  'user/unfollow': UserUnfollow,
  'chat/new': NewChat
};

router.post('/', async function(req, res, next){
  let object = new eventList[req.body.event](req);
  await object.start();
  res.end()
});

module.exports = router;