import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../libs/utils.js';
import cloudinary from '../libs/cloudinary.js';


export const signup = async (req, res) => {
const { fullName, email, password } = req.body;
try {

    if(!fullName || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    if(password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }   

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = new User({
        fullName,
        email,
        password: hashedPassword,
    });

    //save user to database 
    if(newUser){
    await newUser.save();
    //genrate token
    await generateToken(newUser._id, res);
    res.status(201).json({
        message:"User created Sucessfully",
        _id:newUser._id,
        fullName:newUser.fullName,
        email:newUser.email,
        profilePic:newUser.profilePic
    });
    }
    else{
        return res.status(500).json({message:"Invalid user data"})
    }
}
catch(error){
    res.status(500).json({message:"Internal server error"});
}
};



export const login= async(req,res)=>{
    const{email,password}=req.body;
    try{
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({message:"Invalid  credentials"});
        }
        const comparePassword=await bcrypt.compare(password,user.password);
        if(!comparePassword){
            return res.status(400).json({message:"Invalid  credentials"});
        } 
        await generateToken(user._id, res);
        res.status(200).json({
            message:"Login sucessful!",
            _id:user._id,
            fullName:user.fullName,
            email:user.email,
            profilePic:user.profilePic
            });  
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}


export const logout = async (req, res) => {
    try{
        res.cookie('token',"",{maxAge:0});
        res.status(200).json({message:"Logout sucessfully"});
        }
        catch(error){
            res.status(500).json({message:"Internal server error"});
        }
}


export const updateProfile = async (req, res) => {
    const {profilePic}=req.body;
    try{
        const userId= req.user._id;
        if(!profilePic){
            return res.status(400).json({message:"Profile picture is required"});
        }

    const updatedResponse= await cloudinary.uploader.upload(profilePic)
    const updatedUser= await User.findByIdAndUpdate(userId,{
        profilePic:updatedResponse.secure_url},{new:true});
        
        res.status(200).json({message:"Profile updated successfully",updatedUser});
    }
    catch(error){
        return res.status(500).json({message:"Internal server error"});
    }
}

 export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        res.status(500).json({message:"Internal server error"});
    }
}