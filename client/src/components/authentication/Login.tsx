import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import VerifyOtp from "../utilities/VerifyOtp";
import { useUserContext } from "../context/UserContext"; 
interface UserInfo {
  email: string;
  password: string,
  cpassword: string
}
interface authData {
  success: boolean,
  message: string,
  otp: number
}
interface authDataR {
  success: boolean,
  message: string,
  otp: number,
  token: string
}
const Login: React.FC = () => {
  const [isPasswordShown, setIsPasswordShown] = useState<boolean>(false);
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const {userInfo, setUserInfo, generatedOtp, setGeneratedOtp} = useUserContext();
  const handleIsPassShown = () => setIsPasswordShown(!isPasswordShown);
  const navigate = useNavigate();
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      [name]: value,
    }));
  };
  const generateOtp = () => {
    fetch('/api/generate-otp', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({email: userInfo.email})
    })
    .then((res)=> res.json())
    .then((data: authData)=> {
if(data.success){
  setGeneratedOtp(data.otp)
  navigate('/verify')
} else {
  console.log("otp not generated")
}
    })
    .catch((err)=> console.log(err))
  }
  const handleLoginUser = () => {
    fetch("/api/login",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include",
    })
      .then((res) => {
        res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => {
        console.log(err);
      });
  };
   const handleRegisteUser = () => {
    fetch("api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userInfo),
      credentials: "include",
    })
    .then((res) => res.json())
    .then((data: authDataR)=> {
      console.log("register:", data)
      if(data.success){
        // generateOtp();
        navigate('/verify')
      }else {
        console.log("message:", data.message)
        setMessage(data.message);
      }
    })
    .catch((err)=> console.log(err))
   }
  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);
  return (
    <div className="w-screen h-screen flex flex-col">
      <div className="flex-grow flex justify-center items-center gap-6 bg-red-500">
        <div className="h-[85%] w-1/4  relative">
          <div className="h-[94%] w-[80%] bg-white rounded-2xl"></div>
          <div className="h-[94%] w-[80%] bg-green-500 absolute bottom-0 right-0 rounded-2xl"></div>
        </div>
        <div className="h-[85%] w-1/4 bg-gray-500 flex flex-col p-4">
          {isRegistered ? (
            <>
             <h1 className="text-center text-3xl font-bold">Blind</h1>
              <h3>Register</h3>
              <label htmlFor="email">email</label>
              <input
                className="w-full"
                type="text"
                id="email"
                name="email"
                onChange={handleInputChange}
              />
              <label htmlFor="password">Password</label>
              <div className="relative">
                <button
                  className="border border-black absolute right-0 top-3"
                  onClick={handleIsPassShown}
                >
                  sh
                </button>
                {isPasswordShown ? (
                  <input
                    className="w-full"
                    type="text"
                    id="password"
                    name="password"
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    className="w-full"
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleInputChange}
                  />
                )}
                <label htmlFor="cpassword">confirm password</label>
                {isPasswordShown ? (
                  <input
                    className="w-full"
                    type="text"
                    id="password"
                    name="cpassword"
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    className="w-full"
                    type="password"
                    id="cpassword"
                    name="cpassword"
                    onChange={handleInputChange}
                  />
                )}
                </div>
                <small className="text-center text-sm text-red-300 font-red my-2 mt-[-2px]">{message}</small>
                <div>
                <button className="border w-full h-10 hover:bg-[#191C3B] hover:text-white rounded-md hover:border-none" onClick={handleRegisteUser}>
                  Register
                </button>
              </div>
            </>
          ) : (
            <>
              <h1 className="text-center text-3xl font-bold">Blind</h1>
              <h3>Log in</h3>
              <label htmlFor="email">email</label>
              <input
                className="w-full"
                type="text"
                id="email"
                name="email"
                onChange={handleInputChange}
              />
              <label htmlFor="password">Password</label>
              <div className="relative">
                <button
                  className="border border-black absolute right-0 top-3"
                  onClick={handleIsPassShown}
                >
                  sh
                </button>
                {isPasswordShown ? (
                  <input
                    className="w-full"
                    type="text"
                    id="password"
                    name="password"
                    onChange={handleInputChange}
                  />
                ) : (
                  <input
                    className="w-full"
                    type="password"
                    id="password"
                    name="password"
                    onChange={handleInputChange}
                  />
                )}
                <div className="text-right mt-[-8px] mr-[-4px]">
                  <small className="hover:text-white transition-all cursor-pointer">
                    Forgot password?
                  </small>{" "}
                </div>
              </div>
              <div className="flex items-center mt-2">
                <input type="checkbox" name="remember" id="remember" />
                <small>Remember me for 30 days</small>
              </div>
              <div>
                <button onClick={handleLoginUser} className="border w-full h-10 hover:bg-[#191C3B] hover:text-white rounded-md hover:border-none">
                  Login
                </button>
              </div>
              <small className="text-center mt-4">
                Don't have an account?{" "}
                <span className="text-[#191C3B] hover:cursor-pointer">
                  Register
                </span>{" "}
                now
              </small>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
