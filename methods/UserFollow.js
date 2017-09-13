let BaseHandler = require('./BaseHandler');

function UserFollow(req){
  BaseHandler.apply(this, arguments)
}

UserFollow.prototype = Object.create(BaseHandler.prototype);
UserFollow.prototype.constructor = UserFollow;

UserFollow.prototype.defaultMethod = async function(){
  try{
    await db.sequelize.transaction(async function(t){
      let user = await db.User.findOrCreate({
        where: {
          sender_id: this._getSenderId()
        },
        defaults: {
          sender_id: this._getSenderId()
        }
      }, {transaction: t});
      return user[0]
    })
    
  }catch(e){
    throw e
  }
  
};



module.exports = UserFollow;