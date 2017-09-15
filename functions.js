
let message_update = {
};



let new_chat = {
};


let new_message = {
  sendHellowWorld: async function(obj){
    obj.sendMessage('Elsebek')
  }
};



let user_follow = {

};



let user_unfollow = {

};






module.exports = {
  'message/new': new_message,
  'message/update': message_update,
  'user/follow': user_follow,
  'user/unfollow': user_unfollow,
  'chat/new': new_chat
};