let db = require('../models');
let config = require('../config');
let request = require('request');

function BaseHandler(req){
  this.data = req.body.data;
  this.event = req.body.event
}

BaseHandler.prototype.getEvent = async function(){
  try{
      let event = await db.Event.findOne({
        where:{
          event_name: this.event
        }
      });
      if(event === null){
        throw new Error('not found event in getEvent method')
      }
      return event
  }catch(e){
    throw e
  }
};

BaseHandler.prototype._getSenderId = function(){
  if(this.event === 'message/new' || this.event === 'message/update'){
    return this.data.sender_id
  }else if(this.event === 'user/follow' || this.event === 'user/unfollow'){
    return this.data.id
  }else if(this.event === 'chat/new'){
    return this.data.id
  }
};

BaseHandler.prototype.getUser = async function(){
  if(this._getSenderId() === undefined){
    console.log(this.event)
    console.log(this.data)
  }
  try{
    let user = await db.User.findOrCreate({
      where: {
        sender_id: this._getSenderId()
      },
      defaults: {
        sender_id: this._getSenderId()
      }
    });
    return user[0];
  }catch(e){
    throw e
  }
};

BaseHandler.prototype._getCurrentLastMethod = async function(){
  try{
    let user = await this.getUser();
    let event = await this.getEvent();
    return user[event.field_name];
  }catch(e){
    throw e
  }
};


BaseHandler.prototype._saveFollowMethod = async function(){
  try {
    let lastMethod = await this._getCurrentLastMethod();
    let listOfMethods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    console.log(listOfMethods);
    let index = listOfMethods.indexOf(lastMethod);
    if(index === -1){
      console.log('NOT FOUND METHOD');
      return false
    }
    let user = await this.getUser();
    let event = await this.getEvent();
    let field_name = event.field_name;
    let secondMethod = listOfMethods[index + 1];
    if(secondMethod === undefined){
      console.log("NOT FOUND NEXT METHOD");
      let funcWithoutConst = listOfMethods.slice(1)[0];
      if(funcWithoutConst.length > 0){
        user[field_name] = funcWithoutConst[0];
        await user.save();
        return true
      }
      return false
    }
    user[field_name] = secondMethod;
    await user.save();
    return true
  }catch(e){
    throw e
  }
};

//Нужен this.chat_id от nambaone
BaseHandler.prototype.sendMessage = async function(message){
  let data = {
    url: config.apiUrl + '/chats/' + this.chat_id + '/write',
    method: 'POST',
    body: {
      type: 'text/plain',
      content: message
    },
    headers: {
      'X-Namba-Auth-Token': config.token
    },
    json: true
  };
  return new Promise((resolve, reject)=>{
    request(data, (error, req, body)=>{
      if(error){
        reject(error)
      }
      console.log('send message');
      resolve(body)
    })
  })
};

BaseHandler.prototype._callFunction = async function(methodName){
  try{
    await this[methodName](this)
  }catch(e){
    if(e instanceof TypeError){
      console.log('NOT FOUND THIS METHOD IN YOU FUNCTIONS LIST');
      throw e
    }
  }
};

BaseHandler.prototype.start = async function(){
  try{
    let lastMethod = await this._getCurrentLastMethod();
    await this._callFunction(lastMethod);
    await this._saveFollowMethod();
    return 'ok'
  }catch(e){
    throw e
  }
};

module.exports = BaseHandler;