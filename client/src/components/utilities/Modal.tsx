import React, { useEffect, useRef } from 'react'
import { useThreadContext } from '../context/ThreadsContext'; 
interface ModalProps {
  onClose: () => void;
  getThreadValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  addThread: (thread: string) => void
}

const Modal:React.FC<ModalProps> = ({ onClose,getThreadValue, addThread }) => {
  const { thread,setTotalThreads } = useThreadContext();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        addThread(thread);
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [thread, addThread, onClose]);   
  return (
    <div id='modal' className=' w-4/5 p-4 flex flex-col  absolute left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] bg-white box-shadow'>
      <input ref={inputRef} onChange={getThreadValue} className='border-black border mb-4 px-4 py-1' type="text" placeholder='Enter thread name' />
      <button onClick={() => addThread(thread)} className='success-btn'>Create</button>
      <button onClick={onClose} className='success-btn'>Close</button>
    </div>
  )
}

export default Modal
