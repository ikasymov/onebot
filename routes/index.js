var express = require('express');
var router = express.Router();
let db = require('../models');
let MessageUpdate = require('../methods/MessageUpdate');
let NewMessage = require('../methods/NewMessage');
let NewChat = require('../methods/NewChat');
let UserUnfollow = require('../methods/UserUnfollow');
let UserFollow = require('../methods/UserFollow');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

MessageUpdate.prototype.hello = async function(){
  console.log('hello world')
};

