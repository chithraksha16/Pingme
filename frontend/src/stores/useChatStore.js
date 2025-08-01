import {create} from 'zustand';
import {axiosInstance} from '../libs/axios'
import {toast} from 'react-hot-toast'
import { useAuthStore } from './useAuthStore';

export const useChatStore=create((set,get)=>({
    messages:[],
    users:[],
    selectedUser:null,
    isUserLoading:false,
    isMessageLoading:false,
    onlineUsers:[],

    getUsers: async()=>{
        set({isUserLoading:true})
        try{
            const res= await axiosInstance.get("/messages/users");
            console.log("Fetched users:", res.data);
            set({users:res.data})
        }
        catch(error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isUserLoading:false})
        }
        
    },

    getMessages: async(userId)=>{
        set({isMessageLoading:true})
        try{
            const res=await axiosInstance.get(`/messages/${userId}`);
            set({messages:res.data})
        }
        catch(error){
            toast.error(error.response.data.message)
        }
        finally{
            set({isMessageLoading:false})
        }
    },

    sendMessages: async (messageData) => {
    const { selectedUser, messages } = get();
    try {
    const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    set({ messages: [...messages, res.data] });
    } catch (error) {
    toast.error(error.response.data.message);
    }
  },
    subscribeToMessages:()=>{
        const {selectedUser}=get()
        if(!selectedUser) return;

        const socket=useAuthStore.getState().socket;

        socket.on("newMessage",(newMessage)=>{
            set({
                messages:[...get().messages,newMessage]
            })
        })
    },

    unSubscribeFromMessages: ()=>{
        const socket=useAuthStore.getState().socket;
        socket.off("newMessage")
    },

    setSelectedUser:(selectedUser) => set({selectedUser})
}))