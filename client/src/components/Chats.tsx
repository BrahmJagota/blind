import React, {useState, useEffect} from 'react'
import { useNavigate } from 'react-router-dom';
import { useUserContext } from './context/UserContext'; 
import { useThreadContext } from './context/ThreadsContext';
import { Link } from 'react-router-dom';
import { useUtilityContext } from './context/UtilityContext';
interface Idata {
  success: boolean,
  redirect: boolean,
  message: string | string[]
}
interface Imessage {
  thread: string,
  createdBy: string,
  expires: Date
}
interface threadInterface {
  thread: string,
  createdBy: string
}
interface Ithread {
  success: boolean,
  message: Imessage[]
}
const Chats:React.FC = () => {
  const navigate = useNavigate();
  const {isProfileModalOpen} = useUtilityContext();
  const {totalThreads, handleGetThreads, setCurrentThread} = useThreadContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const {userId} = useUserContext();
  const [roomsJoined, setRoomsJoined] = useState<string[]>([]);
  function handleCurrThread (thread: string) {
    setCurrentThread(thread)
  }

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
  useEffect(()=> {
    setIsLoading(true);
    fetch('/api/get-threads')
    .then((res)=> res.json())
    .then((data: Ithread) => {
      console.log("dataaaa",data) 
      if(data.success){
        const newThreads: threadInterface[] = data.message.map((item) => item);
        handleGetThreads(newThreads);
        setIsLoading(false);
      }
    })
    .catch((err) => console.log(err))
  },[]) 
  useEffect(()=> {
    console.log("total thread console", totalThreads)
  },[totalThreads])
  return (
    <div id='chats' className={isProfileModalOpen ?  `w-1/4 h-full border-2 flex flex-col p-4 blur` : `w-1/4 h-full border-2 flex flex-col p-4`}>
      <h1 className='text-2xl font-semibold'>Rooms Joined</h1>
      <input type="search" name="search" id="search"  className='rounded-2xl border-none'/>
      <div>
        <ul>
          
        { totalThreads.length > 0 ? (
                  totalThreads
                  .filter(th => th.createdBy === userId)
                  .map((th, index) => (
                    <Link className="link" onClick={()=>  handleCurrThread(th.thread)} to={`/home/${th.thread}`} key={index}>
                      {th.thread}
                    </Link>
                  ))
        ): (
          <li>
            No rooms joined
          </li>
        )
              }
        </ul>
      </div>
    </div>
  )
}

export default Chats
