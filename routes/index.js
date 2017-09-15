var express = require('express');
var router = express.Router();
let path = require('path')
let config = require('../config');
let instance = require('../methods/createInstance');

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/logs', function(req, res, next) {
  res.sendFile(path.join(config.logFile))
});

router.post('/', async function(req, res, next){
  try{
    await instance(req);
    res.end()
  }catch(e){
    console.log(e.message)
  }
  
});

module.exports = router;