import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
    try {
        const {content, recieverId} = req.body;

        const newMessage = await Message.create({
            sender: req.user.id,
            receiver: recieverId,
            content
        });

        //TODO: send message in real-time => SOCKET.IO

        res.status(201).json({
            success:true,
            newMessage
        })
    } catch (error) {
        console.log("Error in send Message: ", error)
        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};


export const getConversation = async (req, res) => {
    const {userId} = req.params;
    try {
        const message = await Message.find({
            $or: [
                {sender: req.user._id, receiver: userId},
                {sender: userId, receiver: req.user._id}
            ]
        }).sort("createdAt");

        res.status(200).json({
            success: true,
            message
        })
    } catch (error) {
        console.log("Error in getConversation: ", error);
        res.status(500).json({
            success:false,
            message: "Internal Server Error"
        })
    }
};