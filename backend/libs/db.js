import mongoose from "mongoose";

const connectDB=()=>{
    mongoose.connect(process.env.MONGO_URI,{
        dbName:'Pingme'
    }).then(()=>{
        console.log("Database connected");
    }).catch((error)=>{
        console.log("DB connection failed",error);
    });
}

export default connectDB;

