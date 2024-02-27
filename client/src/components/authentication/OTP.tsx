import React, { useEffect } from 'react'
import { useUserContext } from '../context/UserContext';
import VerifyOtp from '../utilities/VerifyOtp';
 
const OTP:React.FC = () => {
    const {userInfo} = useUserContext();
    // useEffect(()=> {
    //   fetch('/api/logout')
    //   .then((res)=> res.json())
    //   .then((data)=> console.log('logout', data))
    // },[])
  return (
    <div id='otp-container'>
      <VerifyOtp email={userInfo.email}/>
    </div>
  )
}

export default OTP
