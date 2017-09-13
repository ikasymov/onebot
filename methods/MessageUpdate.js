let BaseHandler = require('./BaseHandler');

function MessageUpdate(req){
  BaseHandler.apply(this, arguments)
  this.chat_id = this.data.chat_id
}

MessageUpdate.prototype = Object.create(BaseHandler.prototype);
MessageUpdate.prototype.constructor = MessageUpdate;

MessageUpdate.prototype.defaultMethod = async function(){
  console.log('default value')
};



module.exports = MessageUpdate;