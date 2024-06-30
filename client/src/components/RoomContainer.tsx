import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { Link } from "react-router-dom"
import { useUserContext } from "./context/UserContext"
import Modal from "./utilities/Modal";
import { useThreadContext } from "./context/ThreadsContext";
export enum RoomFilter {
DEFAULT,
PUBLIC,
USER
}
interface threadInterface {
    thread: string,
    createdBy: string
  }
interface threadData {
    success: boolean,
    message: threadInterface
  }
enum RoomType {
    PUBLIC,
    PRIVATE,
    DEFAULT
  }
  interface IRoom {
    roomName: string,
    roomType: "DEFAULT" | "PUBLIC" | "PRIVATE",
    createdBy: string,
    roomId: string
  }
interface RoomContainerProps {
    rooms: IRoom[]
    roomFilter: RoomFilter
}

export default function RoomContainer  ({rooms, roomFilter}: RoomContainerProps) {
    const {userId} = useUserContext()
    const {createRoom, setCreateRoom, addNewThread, setCurrentThread} = useThreadContext()
    const [isModelOpen, setIsModalOpen] = useState<boolean>(false)
    function closeModal () {
        setCreateRoom({
          roomName: '',
          roomType: ''
        })
        setIsModalOpen(false);
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

    const filteredRooms = rooms.filter(room => {
        if(roomFilter === RoomFilter.DEFAULT) {
            return room.roomType == "DEFAULT"
        } else if(roomFilter === RoomFilter.PUBLIC) {
            return room.roomType == "PUBLIC"
        } else if(roomFilter === RoomFilter.USER) {
            return room.createdBy === userId
        }
    })
    return (
        <div className="w-full h-full border-black border-2 rounded-md relative">
            {roomFilter === RoomFilter.PUBLIC && isModelOpen && (
                <div className="w-full h-full   ">
                <Modal onClose={closeModal} handleCreateRoom={addToTotalThreads}/>
                </div>
            )}
            <div className="flex justify-between items-center px-2">
            {roomFilter === RoomFilter.PUBLIC && filteredRooms.length === 0 && !isModelOpen ? 'No room found you can create one to start' : ''}
                {roomFilter === RoomFilter.PUBLIC && !isModelOpen && ( <FontAwesomeIcon icon={faPenToSquare} onClick={() => setIsModalOpen(true)} className=" absolute right-2 top-1 cursor-pointer"/> ) }
            </div>
            {roomFilter === RoomFilter.PUBLIC && isModelOpen ? '' : 
                filteredRooms.map((room) => (
                    <div key={room.roomId}>
                        <Link to={`${room.roomName}/${room.roomId}`} >{room.roomName}</Link>
                    </div>
                ))
            }
        </div>
    )
}