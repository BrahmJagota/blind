import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Modal from "./utilities/Modal";
import { useThreadContext } from "./context/ThreadsContext";
import Navbar from "./Navbar";

interface IData {
  success: boolean,
  message: string[]
}
interface Imessage {
  thread: string,
  createdBy: string,
  expires: Date
}
interface Ithread {
  success: boolean,
  message: Imessage[]
}
const Home: React.FC<IsocketProp> = ({socket}) => {
  const { thread, setThread, totalThreads,setTotalThreads ,addNewThread, handleGetThreads, currentThread, setCurrentThread } = useThreadContext();
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  function getThreadValue(e: React.ChangeEvent<HTMLInputElement>) {
    setThread(e.target.value);  
  }

  function handleCurrThread (thread: string) {
    setCurrentThread(thread)
  }

    useEffect(()=> {
      setCurrentThread('Home')
    },[])
    useEffect(()=> {
      fetch('test')
      .then((res) => res.json())
      .then((data) => console.log("dekh", data))
    },[])
    useEffect(()=> {
    console.log('fffdf',thread)
  },[thread])
  function handleCreateThread () {
    setIsModalOpen(true)
  }
  const addToTotalThreads = (newThread: string) => {
    addNewThread(newThread);
    setIsModalOpen(false);
    setCurrentThread(thread); // being used in the navbar as title
    fetch('/api/create-thread', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({thread: thread,
      createdBy: "me"})
    })
    .then((res) => res.json())
    .then((data: IData) => {
      if(data.success){
        console.log("ffll",data)
        addNewThread(thread)
        // navigate(`/home/${thread}`)
      } else {
        console.log(data.message)
      }
    })
    .catch((err) => console.log(err))
  };

  useEffect(()=> {
    setIsLoading(true);
    fetch('/api/get-threads')
    .then((res)=> res.json())
    .then((data: Ithread) => {
      console.log("dataaaa",data) 
      if(data.success){
        const newThreads: string[] = data.message.map((item) => item.thread);
        handleGetThreads(newThreads);
        setIsLoading(false);
      }
    })
    .catch((err) => console.log(err))
  },[]) 
  
  function closeModal () {
    setIsModalOpen(false);
  }
  return (
    <div id="home">
      <div className="w-screen">
      <Navbar />
      </div>
        <div className="container">
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
              <Link className="link" to={`/home/${th}`} onClick={() => handleCurrThread(th)}>{th}</Link>
            ))}
          </div>
            <button className="" onClick={handleCreateThread}>Create thread</button>
            </div>
            {isModalOpen && (
              <Modal addThread={addToTotalThreads} onClose={closeModal} getThreadValue={getThreadValue}/>
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
              <Modal addThread={addToTotalThreads} onClose={closeModal} getThreadValue={getThreadValue} />
            )}
            </>
        )}
      </div>
      <div id="decide" className="content">
        <p>Not available at this moment</p>
      </div>
      </div>
    </div>
  );
};

export default Home;
