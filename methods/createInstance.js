let MessageUpdate = require('./MessageUpdate');
let NewMessage = require('./NewMessage');
let NewChat = require('./NewChat');
let UserUnfollow = require('./UserUnfollow');
let UserFollow = require('./UserFollow');
let func = require('../functions');

console.log(func);

let eventList = {
  'message/new': NewMessage,
  'message/update': MessageUpdate,
  'user/follow': UserFollow,
  'user/unfollow': UserUnfollow,
  'chat/new': NewChat
};

async function createInstanceAndStart(req){
  try{
    let currentEvent = req.body.event;
    let currentClass = eventList[currentEvent];
    let object = new currentClass(req);
    return await object.start();
  }catch(e){
    throw e
  }
  
}

module.exports = createInstanceAndStart;