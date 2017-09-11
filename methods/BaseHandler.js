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
        name: this.event
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

BaseHandler.prototype.getSenderId = function(){
  if(this.event === 'message/new' || this.event === 'update/message'){
    return this.data.sender_id
  }else if(this.event === 'user/follow' || this.event === 'user/unfollow'){
    return this.data.id
  }else if(this.event === 'chat/new'){
    return this.data.id
  }
};

BaseHandler.prototype.getUser = async function(){
  try{
    let user = await db.User.findOne({
      sender_id: this.getSenderId()
    });
    if(user === null){
      throw new Error('not found user id getUser method')
    }
    return user
  }catch(e){
    throw e
  }
}

BaseHandler.prototype.getCurrentLastMethod = async function(){
  try{
    let user = this.getUser();
    let event = await this.getEvent();
    let lastMethod = await db.Method.findOne({
      where:{
        last: true,
        user_id: user.id,
        event_id: event.id
      }
    });
    if(lastMethod === null){
      return {name: 'defaultMethod'}
    }
  }catch(e){
    throw e
  }
};

BaseHandler.prototype.saveFollowMethod = async function(){
  try{
    let currentMethod = await this.getCurrentLastMethod();
    let user = this.getUser();
    let event = this.getEvent();
    let method = await db.Method.findAll({
      where:{
        user_id: user.id,
        event_id: event.id
      },
      raw: true
    });
    let filteringMethod = method.filter(item=>{
      if(item.id === currentMethod.id){
        return item
      }
    });
    if(filteringMethod.length > 0){
      let currentMethodIndex = method.indexOf(filteringMethod[0]);
      if (currentMethodIndex === -1){
        console.log('not next methods');
        return currentMethod
      }
      let objectForUpdate = method[currentMethodIndex + 1];
      if(objectForUpdate === undefined){
        return currentMethod
      }
      return objectForUpdate.update({last: true});
    }
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

BaseHandler.prototype.start = async function(){
  try{
    let lastMethod = await this.getCurrentLastMethod();
    await this[lastMethod.name]();
    await this.saveFollowMethod();
    return 'ok'
  }catch(e){
    throw e
  }
};

module.exports = BaseHandler;