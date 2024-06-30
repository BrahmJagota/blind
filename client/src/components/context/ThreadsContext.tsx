import React, {useState, useContext, createContext, ReactNode} from "react";

    interface IThreads {
        createRoom: ICreateRoom,
        // setCreateRoom: (createRoom: ICreateRoom) => void,
        setCreateRoom: (
            userInfo: ICreateRoom | ((prevUserInfo: ICreateRoom) => ICreateRoom)
          ) => void,
        totalThreads: Ithread[],
        setTotalThreads: (totalThreads: Ithread[]) => void,
        currentThread: string,
        setCurrentThread: (currentThread: string) => void,
        addNewThread: (thread: Ithread) => void,
        handleGetThreads: (threads: Ithread[]) => void,
    }

   
    interface Ithread {
        thread: string,
        createdBy: string
    }
interface props {
    children: ReactNode
}

export const ThreadsContext = createContext<IThreads | null>(null);

export const ThreadsContextProvider = ({children}: props) => {
    const [createRoom, setCreateRoom] = useState<ICreateRoom>({
        roomName: '',
        roomType: ''
        });
    const [totalThreads, setTotalThreads] = useState<Ithread[]>([]);
    const [currentThread, setCurrentThread] = useState<string>('Home');

    const addNewThread = (newThread: Ithread) => {
    setTotalThreads((prevThreads) => [...prevThreads, newThread]);
    }
    const handleGetThreads = (newThreads: Ithread[]) => {
        setTotalThreads(newThreads);
    }
    return (
        <ThreadsContext.Provider value={{ createRoom, setCreateRoom, totalThreads, setTotalThreads, currentThread, setCurrentThread, addNewThread, handleGetThreads }}>
            {children}
        </ThreadsContext.Provider>
    )
}

export const useThreadContext = () => {
    const context = useContext(ThreadsContext);
    if (!context) {
            throw new Error('useThreadContext is not used porperly')
    } else {
        return context;
    }
}