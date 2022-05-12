const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const conSchema = new Schema({
     socketId: {
          type: String
     },
     senderId: {
          type: String
     },
     receiverId: {
          type: String
     }
});

module.exports = mongoose.model("Conversation", conSchema);