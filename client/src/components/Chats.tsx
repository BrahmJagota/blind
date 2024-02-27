import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
interface Idata {
  success: boolean,
  redirect: boolean,
  message: string | string[]
}
const Chats:React.FC = () => {
  const navigate = useNavigate();
  const [roomsJoined, setRoomsJoined] = useState<string[]>([]);
  useEffect(()=>{
    fetch('/api/rooms-joined')
    .then((res)=> res.json())
    .then((data) => {
      console.log("rooms data",data)
      if(data.redirect){
        // navigate('/login')
      } else if(data.success) {
        setRoomsJoined(data.message)
      }
    })
    .catch((err) => console.log(err))
  },[])
  return (
    <div id='chats' className='w-1/4 h-full border-2 flex flex-col p-4'>
      <h1 className='text-2xl font-semibold'>Rooms Joined</h1>
      <input type="search" name="search" id="search"  className='rounded-2xl border-none'/>
      <div>
        <ul>
          <li>Chat one</li>
          <li>Chat two</li>
        </ul>
      </div>
    </div>
  )
}

export default Chats
