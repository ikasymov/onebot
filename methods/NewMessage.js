let BaseHandler = require('./BaseHandler');

function NewMessage(req){
  BaseHandler.apply(this, arguments)
}

NewMessage.prototype = Object.create(BaseHandler.prototype);
NewMessage.prototype.constructor = NewMessage;

NewMessage.prototype.defaultMethod = async function(){
  console.log('default value')
};


module.exports = NewMessage;