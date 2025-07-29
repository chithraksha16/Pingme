import jwt from 'jsonwebtoken';

export const generateToken =async(userId,res)=>{
    const token=jwt.sign({userId},process.env.JWT_SECRET,{
    expiresIn:'7d'
    });
    res.cookie('token',token,{
        maxAge:7 *24 *60* 60*1000, // 7 days
        httpOnly: true, //prevent xss attacks
        sameSite: 'None', //prevent csrf attackss
        secure:process.env.NODE_ENV !== 'development'
    })
    return token;


}