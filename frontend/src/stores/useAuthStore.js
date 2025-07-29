import {create} from 'zustand';
import {axiosInstance} from '../libs/axios'
import toast from 'react-hot-toast';
import {io} from 'socket.io-client'

const BASE_URL=import.meta.env.VITE_API_URL;

export const useAuthStore = create((set,get)=>({
    authUser:null,
    isSigningup:false,
    isLoggingIng:false,
    isUpdatingProfile:false,
    onlineUsers:[],
    isCheckingAuth:true,
    socket:null,

    checkAuth: async ()=>{
        try{
            const res= await axiosInstance.get("/auth/check");
            set({authUser:res.data})
            get().connectSocket()
        }
        catch(error){
            set({authUser:null})
        }
        finally{
            set({isCheckingAuth:false})
        }
    },

    signup: async(data)=>{
        set({isSigningup:true})
        try{
            const res=await axiosInstance.post("/auth/signup",data)
            set({authUser:res.data});
            toast.success("account created Successfully!")
            get().connectSocket()
        }
        catch(error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isSigningup:false});
        }
    },

    login: async(data)=>{
        set({isLoggingIng:true})
        try{
            const res=await axiosInstance.post("/auth/login",data)
            set({authUser:res.data})
            toast.success("Login Sucessfull")
            get().connectSocket()
        }
        catch(error){
        toast.error(error.response.data.message)
        }
        finally{
            set({isLoggingIng:false})
        }
    },

    logout: async()=>{
        try{
            await axiosInstance.post("/auth/logout")
            set({authUser:null})
            toast.success("Logout successfully")
            get().disconnectSocket()
        }
        catch(error){
            toast.error("Something went wrong")
        }

    },

    updateProfile: async(data)=>{
    set({isUpdatingProfile:true})
    try{
        const res=await axiosInstance.put("/auth/update-profile",data);
        set({authUser:res.data})
        toast.success("Profile picture Updated")
    }
    catch(error){
        console.error("Error in Uploading",error)
        toast.error(error.response.data.message)
    }
    finally{
        set({isUpdatingProfile:false})
    }
    },

    connectSocket: ()=>{
        const {authUser}=get()
        if(!authUser || get().socket?.connected) return ;
    
        const socket= io(BASE_URL,{
            query:{
                userId:authUser._id
            },
        })
        socket.connect()
        set({socket:socket})

        socket.on("getOnlineUser",(userIds)=>{
            set({onlineUsers:userIds})
        })
    },
    disconnectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect()
    }
}))