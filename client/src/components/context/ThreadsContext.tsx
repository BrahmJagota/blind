import React, {useState, useContext, createContext, ReactNode} from "react";

    interface IThreads {
        thread: string,
        setThread: (threads: string) => void,
        totalThreads: string[],
        setTotalThreads: (totalThreads: string[]) => void,
        currentThread: string,
        setCurrentThread: (currentThread: string) => void,
        addNewThread: (thread: string) => void,
        handleGetThreads: (threads: string[]) => void,
    }

interface props {
    children: ReactNode
}

export const ThreadsContext = createContext<IThreads | null>(null);

export const ThreadsContextProvider = ({children}: props) => {
    const [thread, setThread] = useState<string>("");
    const [totalThreads, setTotalThreads] = useState<string[]>([]);
    const [currentThread, setCurrentThread] = useState<string>('Home');

    const addNewThread = (newThread: string) => {
    setTotalThreads((prevThreads) => [...prevThreads, newThread]);
    }
    const handleGetThreads = (newThreads: string[]) => {
        setTotalThreads(newThreads);
    }
    return (
        <ThreadsContext.Provider value={{ thread, setThread, totalThreads, setTotalThreads, currentThread, setCurrentThread, addNewThread, handleGetThreads }}>
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