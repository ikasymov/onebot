let db = require('./models');


db.Event.bulkCreate([
  {event_name: 'message/new', field_name: 'new_message'},
  {event_name: 'message/update', field_name: 'message_update'},
  {event_name: 'user/follow', field_name: 'user_follow'},
  {event_name: 'user/unfollow', field_name: 'user_unfollow'},
  {event_name: 'chat/new', field_name: 'new_chat'},
]).then(result=>{
  console.log(result)
}).catch(e=>{
  console.log(e)
})
