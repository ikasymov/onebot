let MessageUpdate = require('./methods/MessageUpdate');
let NewMessage = require('./methods/NewMessage');
let NewChat = require('./methods/NewChat');
let UserUnfollow = require('./methods/UserUnfollow');
let UserFollow = require('./methods/UserFollow');

NewMessage.prototype.secondMessage = async function(){
  await this.sendMessage('first Message')
};

MessageUpdate.prototype.check = async function(){
  await this.sendMessage('update')
}


module.exports = {

};