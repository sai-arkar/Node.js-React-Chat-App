const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    send: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }],
    receive: [{
        type: Schema.Types.ObjectId,
        ref: "Message"
    }]
});

module.exports = mongoose.model("User", userSchema);