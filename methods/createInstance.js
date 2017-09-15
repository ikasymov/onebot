let MessageUpdate = require('./MessageUpdate');
let NewMessage = require('./NewMessage');
let NewChat = require('./NewChat');
let UserUnfollow = require('./UserUnfollow');
let UserFollow = require('./UserFollow');
let BaseHandler = require('./BaseHandler');
let functions = require('../functions');

let eventList = {
  'message/new': NewMessage,
  'message/update': MessageUpdate,
  'user/follow': UserFollow,
  'user/unfollow': UserUnfollow,
  'chat/new': NewChat
};

async function createInstanceAndStart(req){
  let currentEvent = req.body.event;
  let currentClass = eventList[currentEvent];
  console.log(currentClass)
  console.log("hello")
  let currentEventPrototypes = functions[currentEvent];
  let dict = {
    constructor: currentClass
  };
  for (let i in currentEventPrototypes){
    let object = currentEventPrototypes[i];
    dict[object.name] = object;
  }
  currentClass.prototype = Object.create(BaseHandler.prototype);
  currentClass.prototype = dict;
  let object = new currentClass(req);
  return await object.start();
}

module.exports = createInstanceAndStart;