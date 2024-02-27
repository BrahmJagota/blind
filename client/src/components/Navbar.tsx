import React, {useEffect} from 'react'
import { useThreadContext } from './context/ThreadsContext';
import { useUserContext } from './context/UserContext';
import { useNavigate } from 'react-router-dom';
interface Idata {
  success: boolean,
  redirect: boolean,
  message: string
}
const Navbar:React.FC = () => {
  const navigate = useNavigate();
  const { currentThread} = useThreadContext();
  const {setUserId} = useUserContext();
  useEffect(()=> {
    fetch('/me')
    .then((res)=> res.json())
    .then((data: Idata) => {
      console.log("userId", data.message)
      if(data.redirect){
        navigate('/login');
      } else {
        setUserId(data.message);
      }
    })
  },[])
  return (
    <div id='navbar' className='flex justify-between items-center px-4 h-12 bg-blue-500'>
      <div>
        <h1 className='text-2xl font-semibold'>Blind</h1>
      </div>
      <div>
        <h2 className='text-2xl font-bold'>{currentThread}</h2>
      </div>
      <div className='flex gap-2'>
        <h3 className='text-xl font-medium'>Username</h3>
        <div className="profile border rounded-[50%] w-9 h-9 bg-red-500"></div>
      </div>
    </div>
  )
}

export default Navbar
