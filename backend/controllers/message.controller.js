import User from '../models/user.model.js';
import Message from '../models/message.model.js';
import cloudinary from '../libs/cloudinary.js';
import { getRecieverSocketId,io } from '../libs/socket.js';




export const getUsersForSideBar=async(req,res)=>{
    try{
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({_id:{$ne:loggedInUserId}}).select("-password");
        res.status(200).json(filteredUsers);
    }
    catch(error){
        console.error('Error fetching users for sidebar:', error);
        res.status(500).json({error: 'Internal server error'});
    }
}

 export const getMessages=async(req,res)=>{
    try{
        const {id:userToChatId}=req.params;
        const myId=req.user._id;
        const messages= await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        res.status(200).json(messages)
    }
    catch(error){
        console.error("Error: to getting Messages");
        res.status(500).json({message:"Internal server Error"})
    }
}


export const sendMessages = async(req,res)=>{
    const {text,image}=req.body;
    try{
        const {id:receiverId}=req.params;
        const senderId=req.user._id;


        let imageUrl;
        if(image){
        const uploadResponse= await cloudinary.uploader.upload(image)
        imageUrl=uploadResponse.secure_url;
        }

        const message= await Message.create({
            senderId,
            receiverId,
            text,
            image:imageUrl
        })

        const receiverSocketId=getRecieverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",message)
        }

        res.status(201).json(message)
    }
    catch(error){
        console.error("Error: during sending messages",error)
        res.status(500).json({message:"Internal server Error"})
    }
}