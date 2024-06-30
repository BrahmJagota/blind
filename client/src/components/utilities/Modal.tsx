import React, { useEffect, useRef } from 'react'
import { useThreadContext } from '../context/ThreadsContext'; 
interface ModalProps {
  onClose: () => void;
  // getThreadValue: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleCreateRoom: (createRoom: ICreateRoom) => void
}

const Modal:React.FC<ModalProps> = ({ onClose, handleCreateRoom }) => {
  const { createRoom,setTotalThreads, setCreateRoom } = useThreadContext();
  const inputRef = useRef<HTMLInputElement>(null);

  const getThreadValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setCreateRoom((prevState: ICreateRoom) => ({
            ...prevState,
            [name]: value,
        }));
    };
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleCreateRoom(createRoom);
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [createRoom, handleCreateRoom, onClose]);   
  return (
    <div id='modal' className=' w-4/5 p-4 flex flex-col  absolute left-1/2 top-1/2 translate-y-[-50%] translate-x-[-50%] bg-white box-shadow'>
      <input ref={inputRef} onChange={getThreadValue} name='roomName' value={createRoom.roomName} className='border-black border mb-4 px-4 py-1' type="text" placeholder='Enter thread name' />
      <div className='flex'>
      <input onChange={getThreadValue} type="radio" name="roomType" id="publicRoom" value="PUBLIC" />
       <label htmlFor="publicRoom">Public</label>
        <input onChange={getThreadValue} type="radio" name="roomType" id="privateRoom" value="PRIVATE" />
      <label htmlFor="privateRoom">Private</label>
      </div>
      <button onClick={() => handleCreateRoom(createRoom)} className='success-btn'>Create</button>
      <button onClick={onClose} className='success-btn'>Close</button>
    </div>
  )
}

export default Modal
