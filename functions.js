let NewMessage = require('./methods/NewMessage');
let NewChat = require('./methods/NewChat');
let UserUnfollow = require('./methods/UserUnfollow');
let UserFollow = require('./methods/UserFollow');

NewMessage.prototype.secondMessage = async function(){
  let token = await this.saveImageEndReturnToken('https://geographyofrussia.com/wp-content/uploads/2014/11/20-21.jpg');
  await this.sendMessage('first Message', [token])
};



module.exports = {

};