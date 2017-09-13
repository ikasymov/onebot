let BaseHandler = require('./BaseHandler');

function NewMessage(req){
  BaseHandler.apply(this, arguments);
  this.chat_id = this.data.chat_id
}

NewMessage.prototype = Object.create(BaseHandler.prototype);
NewMessage.prototype.constructor = NewMessage;

NewMessage.prototype.defaultMethod = async function(){
  console.log('default value')
};


module.exports = NewMessage;