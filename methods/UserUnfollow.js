let BaseHandler = require('./BaseHandler');

function UserUnfollow(req){
  BaseHandler.apply(this, arguments)
}

UserUnfollow.prototype = Object.create(BaseHandler.prototype);
UserUnfollow.prototype.constructor = UserUnfollow;

UserUnfollow.prototype.defaultMethod = async function(){
  console.log('default value')
};


module.exports = UserUnfollow;