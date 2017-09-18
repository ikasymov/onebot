let db = require('../models');
let config = require('../config');
let request = require('request');
let download = require('image-downloader');
let superagent = require('superagent');
let fs = require('fs');

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

BaseHandler.prototype._getListOfMethods = function(){
  return Object.getOwnPropertyNames(Object.getPrototypeOf(this));
};


BaseHandler.prototype._getSecondMethod = async function(){
  try{
    let lastMethod = await this._getCurrentLastMethod();
    let methods = this._getListOfMethods();
    let index = methods.indexOf(lastMethod);
    if(index === -1){
      throw new Error('NOT FOUND METHOD')
    }
    return methods[index + 1];
  }catch(e){
    throw e
  }
};

BaseHandler.prototype.saveToFirstMethod = async function(){
  let user = await this.getUser();
  let event = await this.getEvent();
  let methods = await this._getListOfMethods();
  let methodListWithoutConstructor = methods.slice(1)[0];
  if(methodListWithoutConstructor.length > 0){
    user[event.field_name] = methodListWithoutConstructor;
    await user.save();
    return true
  }
  throw new Error('not method in list without constructor')
};


BaseHandler.prototype._saveFollowMethod = async function(){
  try {
    let user = await this.getUser();
    let event = await this.getEvent();
    let field_name = event.field_name;
    let secondMethod = await this._getSecondMethod();
    if(secondMethod === undefined){
      await this.saveToFirstMethod();
      return true
    }
    user[field_name] = secondMethod;
    await user.save();
    return true
  }catch(e){
    throw e
  }
};

function deleteFile(path){
  return new Promise((resolve, reject)=>{
    fs.unlink(path, function (error) {
      if(error){
        reject(error)
      }
      resolve()
    })
  });
}

BaseHandler.prototype.saveImageEndReturnToken = async function(imgUrl){
  let format = imgUrl.match(/\.([0-9a-z]+)(?=[?#])|(\.)(?:[\w]+)$/gmi)[0];
  imgUrl = imgUrl.split('.').slice(0, -1).join('.') + format;
  return new Promise((resolve, reject)=> {
    const options = {
      url: imgUrl,
      dest: './'
    };
    download.image(options).then(({filename, image}) => {
      let file = './'+ filename;
      superagent.post('https://files.namba1.co').attach('file', file).end(function(err, req) {
        if(err){
          deleteFile(filename);
          reject(err)
        }
        deleteFile(file).then(result=>{
          resolve(req.body.file)
        })
      })
    }).catch(e => {
      console.log(e);
      console.log('error download image');
      reject(e)
    })
    setTimeout(()=>{
      reject(new Error('time out'))
    }, 10000)
  })
};
//Нужен this.chat_id от nambaone
BaseHandler.prototype.sendMessage = async function(message, img){
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
  if(img){
    data.body['attachments'] = [{
      type: 'media/image',
      content: img
    }]
  }
  return new Promise((resolve, reject)=>{
    request(data, (error, req, body)=>{
      if(error){
        reject(error)
      }
      resolve(body)
    })
  })
};

BaseHandler.prototype._callFunction = async function(methodName){
  try{
    await this[methodName](this)
  }catch(e){
    if(e instanceof TypeError){
      let user = await this.getUser();
      let event = await this.getEvent();
      throw new Error('NOT FOUND "' + user[event.field_name] +'" FUNCTION IN YOU ' + event.event_name + ' FUNCTION LIST')
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