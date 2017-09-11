let BaseHandler = require('./BaseHandler');

function NewChat(req){
  BaseHandler.apply(this, arguments)
}

NewChat.prototype = Object.create(BaseHandler.prototype);
NewChat.prototype.constructor = NewChat;

NewChat.prototype.defaultMethod = async function(){
  console.log('default value')
};


module.exports = NewChat;