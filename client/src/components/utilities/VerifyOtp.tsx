// make sure to delete otp file and make this a single file
import React, { useEffect, useState } from 'react'
import { useUserContext } from '../context/UserContext'
import { useNavigate } from 'react-router-dom';


interface otpProps {
email: string
}
interface dataProps {
  success: boolean,
  message: string,
}
const VerifyOtp:React.FC<otpProps> = ({email}) => {
  const navigate = useNavigate();
  const {userInfo, generatedOtp} = useUserContext();
  const [message, setMessage] = useState<string>('');
     const [otp, setOtp] = useState<string>('');
     const handleOtpInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
      
        // Use regex to allow only numbers
        const numericRegex = /^[0-9]*$/;
        if (numericRegex.test(inputValue)) {
          setOtp(inputValue);
        } else {
          console.log("Please enter only numbers");
        }
      };
     useEffect(()=>{
        console.log("otp", otp)
     },[otp])

     const handleOtp = () => {
      fetch('/api/verify-otp', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({email, otp})
      })
      .then((res)=>res.json() )
      .then((data: dataProps)=> {
        console.log("verify wala", data)
        if(data.success){
          navigate('/')
        } else {
          console.log("verification:", data.message)
          setMessage(data.message);
        }
      })
      .catch((err) => console.log("verify error", err))
     }
  return (
    <div id='verify-otp' className='w-full h-full bg-blue-500 flex flex-col justify-center gap-20'>
        <div className='flex flex-col justify-center items-center'>
            <div className="icon h-36 w-24 bg-yellow-300">

            </div>
                <h5>Verification</h5>
                <small>You will get otp via email</small>
        </div>
        <div className='flex flex-col justify-center items-center w-4/5 mx-auto'>
            <input onChange={handleOtpInput} value={otp} maxLength={6} type="text" name="otp" className='w-full p-2'/>
            <button onClick={handleOtp} className='border w-full p-2'>VERIFY</button>
            <small className='self-end'>Resend OTP?</small>
            <small className='text-red'>{message}</small>
        </div>
    </div>
  )
}

export default VerifyOtp
