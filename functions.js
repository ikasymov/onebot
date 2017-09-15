let MessageUpdate = require('./MessageUpdate');
let NewMessage = require('./NewMessage');
let NewChat = require('./NewChat');
let UserUnfollow = require('./UserUnfollow');
let UserFollow = require('./UserFollow');

NewMessage.prototype.checkFirstFunc = async function(){
  await this.sendMessage('first Message')
};


module.exports = {

};