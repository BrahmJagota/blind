import {useState, useEffect} from 'react';
import RoomContainer from '../components/RoomContainer';
import Navbar from '../components/Navbar';
import { RoomFilter } from '../components/RoomContainer';
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
export const Home = () => {
    const [rooms, setRooms] = useState<IRoom[]>([])

    // get rooms
    useEffect(()=> {
        fetch('http://localhost:5000/api/get-rooms',
            {
                method: "GEt",
                credentials: 'include'
            }
        )
        .then((res) => res.json())
        .then((data: IRoom[]) => {
            console.log("data", data)
            setRooms(data)
        })
    },[])
    useEffect(() => {
        console.log("rooms", rooms)
    },[rooms])
    return (
        <div id='home' className=''>
            <div className='w-full'>
                <Navbar />
            </div>
            <div className='container p-4'>
            <RoomContainer rooms={rooms} roomFilter={RoomFilter.DEFAULT} />
            <RoomContainer rooms={rooms} roomFilter={RoomFilter.PUBLIC} />
            <RoomContainer rooms={rooms} roomFilter={RoomFilter.USER} />
            <div className='global-chat border-2 w-full border-black'>
                <h1 className='text-black font-bold text-xl text-center'>will add a global chat feature later</h1>
            </div>
            </div>
        </div>
    )
}