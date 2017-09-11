let BaseHandler = require('./BaseHandler');

function UserFollow(req){
  BaseHandler.apply(this, arguments)
}

UserFollow.prototype = Object.create(BaseHandler.prototype);
UserFollow.prototype.constructor = UserFollow;

UserFollow.prototype.defaultMethod = async function(){
  console.log('default value')
};


module.exports = UserFollow;