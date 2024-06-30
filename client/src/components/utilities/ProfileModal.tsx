import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from "@fortawesome/free-solid-svg-icons";
interface props {
 handleCloseModal: () => void;
}
const ProfileModal:React.FC<props> = ({handleCloseModal}) => {
  const handleLogout = () => {
    fetch('/api/logout')
    .then((res)=> res.json())
    .then((data)=> console.log(data) )
    .catch((err) => console.log("error", err))
  }
  return (
    <div id='profile-modal' className='w-full, h-screen z-10 absolute top-0 left-0 right-0'>
      <div className=' filter-blur' onClick={handleCloseModal}></div>
      <div className='bg-red-200 z-100 flex flex-col p-1 pl-2'>
      <FontAwesomeIcon icon={faXmark} className='cursor-pointer h-6 self-end' onClick={handleCloseModal}/>
      <h1 className='text-xl'>settings</h1>
      <hr/>
      <button onClick={handleLogout} className='w-full'>Log out</button>
      </div>
    </div>
  )
}

export default ProfileModal
