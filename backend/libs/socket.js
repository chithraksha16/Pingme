import {Server} from 'socket.io'
import express from 'express'
import http from 'http'



const app=express();

const server=http.createServer(app)



const io= new Server(server,{
    cors:{
        origin:"https://pingme-theta.vercel.app",
        credentials:true
    }
});

 export const getRecieverSocketId=(userId)=>{
    return userSocketMap[userId]
}

//used store the online user
const userSocketMap={}   //userId:socketId

io.on("connection",(socket)=>{
   // console.log("A user connected", socket.id)


const userId=socket.handshake.query.userId;
if(userId) userSocketMap[userId]=socket.id;

// io.emit is used to send all events to the all the connected clients
io.emit("getOnlineUser", Object.keys(userSocketMap))

socket.on("disconnect" ,() =>{
    //console.log("A user disconnected",socket.id)
    delete userSocketMap[userId]
    io.emit("getOnlineUser", Object.keys(userSocketMap))
})
})



export {io,app,server}