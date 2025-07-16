import { Routes,Route, Navigate } from 'react-router-dom'
import './App.css'
import NavBar from './components/NavBar'
import Home from  './pages/Home'
import Signup from  './pages/Signup'
import Login from './pages/Login'
import Setting from './pages/Setting'
import Profile from  './pages/Profile'
import { useAuthStore } from './stores/useAuthStore'
import { useEffect } from 'react'
import {Loader} from 'lucide-react'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './stores/useThemeStore'
function App() {
  const {authUser,checkAuth,isCheckingAuth,onlineUsers}=useAuthStore()
  const {theme}=useThemeStore();


  useEffect(()=>{
    checkAuth();
  },[checkAuth])


  console.log({onlineUsers})
  console.log({authUser})

  if(isCheckingAuth && !authUser) return (
    <div className='flex justify-center items-center h-screen'>
    <Loader className='size-10 animate-spin'/>
    </div>
  )


  return (
    <>
  <div data-theme={theme}>
    <NavBar/>
  <Routes>
    <Route  path='/' element={authUser ? <Home/>: <Navigate to='/login'/>}/>
    <Route  path='/signup' element={ !authUser ? <Signup/> : <Navigate to='/'/> }/>
    <Route  path='/login' element={ !authUser ? <Login/> : <Navigate to='/'/>}/>
    <Route  path='/settings' element={<Setting/>}/>
    <Route  path='/profile' element={ authUser ? <Profile/> : <Navigate to='/login'/>}/>
    
  </Routes>
  <Toaster/>
  </div>
    </>
  )
}

export default App
