const User = require("../model/user");
const Message = require("../model/message");

exports.postMessage = async (req, res, next)=>{
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    const content = req.body.content;

    const newMsg = new Message({
       content: content,
       sender: senderId,
       receiver: receiverId 
    });

    try{
        await newMsg.save();
        // Store In Sender' Array
        let sendUser = await User.findById(senderId);
        console.log(sendUser)
            sendUser.send.push(newMsg);
        await user.save();

        // Store Message In Receiver's Array
        let receiveUser = await User.findById(receiverId);
        console.log(receiveUser)
            receiveUser.receive.push(newMsg);
        await receiveUser.save();

        res.status(201).json({
            message: "Send Message Successfully",
            result: newMsg
        });
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}