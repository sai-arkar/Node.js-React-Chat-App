const User = require("../model/user");
const Message = require("../model/message");

exports.postMessage =async (req, res, next)=>{
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const content = req.body.content;

    try{
        const newMsg = new Message({
            content: content,
            sender: senderId,
            receiver: receiverId 
         });
        await newMsg.save()
        let sender = await User.findById(senderId);
                sender.send.push(newMsg);

        await sender.save();

        let receiver = await User.findById(receiverId);
                receiver.receive.push(newMsg);

        await receiver.save();

            res.status(201).json({
                message: "Send Message Successfully", 
                content: newMsg
            });
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.getMessages = (req, res, next)=>{
    const receiverId = req.params.rId;
    const senderId = req.body.senderId;
    let messages;
    Message.find()
        .then(allMessage=>{
            messages = allMessage.filter((msg)=>
                (msg.sender.toString() === senderId.toString() &&
                msg.receiver.toString() === receiverId.toString())
            )
            res.status(200).json({
                messages: "Get Messages Successfully",
                result: messages
            });
        })
        .catch(err=>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

exports.deleteMessage = (req, res, next)=>{
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const msgId = req.body.msgId;

    Message.findOne({_id: msgId})
        .then(msg =>{
            if(msg.sender.toString() !== senderId.toString()){
                const error = new Error("Not Authorized");
                error.statusCode = 401;
                throw error;
            }
            return Message.findByIdAndRemove(msgId);
        })
        .then(()=>{
            return User.findById(senderId);
        })
        .then((sender)=>{
            sender.send.pull(msgId);
            return sender.save();
        })
        .then(()=>{
            return User.findById(receiverId);
        })
        .then((receiver)=>{
            receiver.receive.pull(msgId);
            return receiver.save();
        })
        .then(()=>{
            res.status(200).json({
                message: "Delete Message Successfully"
            });
        })
        .catch(err =>{
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })

}