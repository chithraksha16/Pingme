import express from 'express';
import dotenv from 'dotenv';
import  connectDB  from './libs/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import messageRoutes from './routes/message.route.js'
import authRoutes from './routes/auth.route.js';
import { app,server } from './libs/socket.js';

dotenv.config()

const PORT=process.env.PORT;



app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:["GET","POST","DELETE","PUT"]
}))


app.use('/api/auth', authRoutes);
app.use('/api/messages',messageRoutes);





server.listen(PORT,()=>{
console.log(`Server is running on PORT ${PORT}`)
connectDB();

})