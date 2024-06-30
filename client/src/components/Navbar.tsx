import React, {useEffect, useState} from 'react'
import { useThreadContext } from './context/ThreadsContext';
import { useUserContext } from './context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import { useUtilityContext } from './context/UtilityContext';
import ProfileModal from './utilities/ProfileModal';
interface Idata {
  success: boolean,
  redirect: boolean,
  message: string
}
const Navbar:React.FC = () => {
  const navigate = useNavigate();
  const { currentThread} = useThreadContext();
  // const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const {isProfileModalOpen, setIsPrtofileModalOpen} = useUtilityContext();
  const {setUserId} = useUserContext();

  const handleProfile = () => {
      console.log("clicked handleProfile");
  }
  const handleCloseModal = () => {
    setIsPrtofileModalOpen(false);
  }
  const handleProfileClick = () => {
    setIsPrtofileModalOpen(true)
  }
  useEffect(()=> {
    fetch('http://localhost:5000/me',{
      method: "GET",
      credentials: 'include'
    })
    .then((res)=> {
      if(res.status === 401) {
        navigate('/login');
      }
     return res.json()
    })
    .then((data: Idata) => {
      console.log("userId", data.message)
        setUserId(data.message);
    })
  },[])
  return (
    <>
    <div className={isProfileModalOpen ? 'blur' : ''}>
    <div id='navbar' className='flex justify-between items-center px-4 h-12 bg-blue-500 relative'>
      <div>
        <Link className='text-2xl font-semibold cursor-pointer' to='/'>Blind</Link>
      </div>
      <div>
        <h2 className='text-2xl font-bold'>{currentThread}</h2>
      </div>
      <div className='flex gap-2'>
        <h3 className='text-xl font-medium'>Username</h3>
        <div onClickCapture={handleProfileClick} className="profile cursor-pointer border rounded-[50%] w-9 h-9 bg-red-500" onClick={handleProfile}></div>
      </div>
          </div>
          </div>
      {isProfileModalOpen ? (
        <ProfileModal handleCloseModal={handleCloseModal}/>
        ): (
          ""
          ) }
          </>
  )
}

export default Navbar
