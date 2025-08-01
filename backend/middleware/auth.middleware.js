import jwt from 'jsonwebtoken';
import User from  '../models/user.model.js';



export const authenticate=async(req,res,next)=>{
   try{
    const token=req.cookies.token;
    if(!token){
        return res.status(401).json({message: 'Unauthorized access- No token provided'});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    if(!decoded){
        return res.status(401).json({message: 'Unauthorized access- Invalid token'});
    }
    const user=await User.findById(decoded.userId).select("-password");
    if(!user){
        return res.status(404).json({message: 'User not found'});
    }
    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware or route handler
}
catch(error){
    res.status(500).json({message: 'Internal server error'});
}
}