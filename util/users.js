const Conversation = require("../model/conversation");

// join user to chat
exports.userJoin = (socketId, senderId, receiverId)=>{
     const con = new Conversation({
          socketId: socketId,
          senderId: senderId,
          receiverId: receiverId
     });
     con.save()
          .then(con=>{
               return con;
          })
          .catch(err=>{
               console.log(err);
          })
}

// get current user
function getCurrentUser(id){
     return users.find(user=> user.id === id);
}

// user leaves chat
function userLeave(id){
     const index = users.findIndex(user => user.id === id);

     if(index != -1){
          return users.splice(index, 1)[0];
     }
}

// Get room users
function getRoomUsers(room){
     return users.filter(user => user.room === room);
}

module.exports = {
     userJoin, 
     getCurrentUser,
     userLeave,
     getRoomUsers
}