import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "./utilities/Modal";
import { useThreadContext } from "./context/ThreadsContext";
import { useUserContext } from "./context/UserContext";
import Navbar from "./Navbar";
import { useUtilityContext } from "./context/UtilityContext";

enum RoomType {
  PUBLIC,
  PRIVATE,
  DEFAULT
}
interface IRoom {
  roomName: string,
  roomType: RoomType,
  createdBy: string,
  roomId: string
}
interface IData {
  success: boolean,
  message: string[]
}
interface Imessage {
  thread: string,
  createdBy: string,
  expires: Date
}
interface threadData {
  success: boolean,
  message: threadInterface
}
interface threadInterface {
  thread: string,
  createdBy: string
}

interface Ithread {
  success: boolean,
  message: Imessage[]
}
const Home: React.FC<IsocketProp> = ({socket}) => {
  const { createRoom, setCreateRoom, totalThreads,setTotalThreads ,addNewThread, handleGetThreads, currentThread, setCurrentThread } = useThreadContext();
  const { userId } = useUserContext();
  const {isProfileModalOpen} = useUtilityContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  function handleCurrThread (thread: string) {
    setCurrentThread(thread)
  }

    useEffect(()=> {
      setCurrentThread('Home')
    },[])
    useEffect(()=> {
      fetch('http://localhost:5000/me',{
        method: "GET",
         credentials: 'include'
      })
      .then((res) => {
       return res.json()
      })
      .then((data: IAuth) => {
        console.log("rsrsoru", data)
        if(data.redirect) {
          navigate('/login')
        }
      })
      .catch((err) => console.log(err))
    },[])
    useEffect(()=> {
    console.log('fffdf',createRoom)
  },[createRoom])
  function handleCreateThread () {
    setIsModalOpen(true)
  }
  const addToTotalThreads = () => {
    setIsModalOpen(false);
    setCurrentThread(createRoom.roomName); // being used in the navbar as title
    fetch('http://localhost:5000/api/create-room', {
      method: "POST",
      credentials: 'include',
      headers: {
        "Content-Type": "application/json",
      },  
      body: JSON.stringify({room: createRoom})
    })
    .then((res) => {
      return res.json();
    })
    .then((data: threadData) => {
      if(data.success){
        console.log("ffll",data)
        addNewThread(data.message)
        // navigate(`/home/${thread}`)
      } else {
        console.log(data.message)
      }
    })
    .catch((err) => console.log(err))
  };

  useEffect(()=> {
    setIsLoading(true);
    fetch('http://localhost:5000/api/get-rooms',{
      method: "GET",
      credentials: 'include'
    })
    .then((res)=> res.json())
    .then((data: IRoom[]) => {
      console.log("dataaaa",data) 
      if(data){
        const newThreads: IRoom[] = data.map((item) => item);
        // handleGetThreads(newThreads);
        setIsLoading(false);
      }
    })
    .catch((err) => console.log(err))
  },[]) 
  useEffect(()=> {
    console.log('total thread', totalThreads)
  },[totalThreads])
  function closeModal () {
    setCreateRoom({
      roomName: '',
      roomType: ''
    })
    setIsModalOpen(false);
  }
  return (
    <div id="home">
      <div className="w-screen">
      <Navbar />
      </div>
        <div className={isProfileModalOpen ? 'blur container' : 'container'}>
      <div id="streams" className="content">
        <Link className="link" to={"/home/btech"} onClick={() => handleCurrThread('B.tech')}>Btech</Link>
        <Link className="link" to={"/home/bba"} onClick={() => handleCurrThread('BBA')}>BBA</Link>
        <Link className="link" to={"/home/bca"} onClick={() => handleCurrThread('BCA')}>BCA</Link>
        <Link className="link" to={"/home/bcom"} onClick={() => handleCurrThread('B.com')}>B.com</Link>
        <Link className="link" to={"/home/bsc"} onClick={() => handleCurrThread('Bsc')}>Bsc</Link>
        <Link className="link" to={"/home/random"} onClick={() => handleCurrThread('Random')}>random</Link>
      </div>
      <div id="create" className="content create-thread relative">
        {totalThreads.length > 0 ? (
          <>
          <div className={isModalOpen ? "blur flex flex-col h-full" : "flex flex-col h-full"}>
          <div className="threads">
            {totalThreads.map((th) => (
              <Link className="link" to={`/home/${th}`} onClick={() => handleCurrThread(th.thread)}>{th.thread}</Link>
            ))}
          </div>
            <button className="" onClick={handleCreateThread}>Create thread</button>
            </div>
            {isModalOpen && (
              <Modal handleCreateRoom={addToTotalThreads} onClose={closeModal}/>
            )}
            </>
        ) : (
          <>
          <div className={isModalOpen ? "blur flex flex-col h-full" : "flex flex-col h-full"}>
          <div className="threads">
            <p>No thread availabe, you may create one to start</p>
          </div>
            <button onClick={handleCreateThread}>Create thread</button>
            </div>
            {isModalOpen && (
              <Modal handleCreateRoom={addToTotalThreads} onClose={closeModal}  />
            )}
            </>
        )}
      </div>
      <div id="decide" className="content">
              {
                  totalThreads
                  .filter(th => th.createdBy === userId)
                  .map((th, index) => (
                    <Link className="link" to={`/home/${th.thread}`} key={index}>
                      {th.thread}
                    </Link>
                  ))
              }
      </div>
      </div>
    </div>
  );
};

export default Home;
