import React, { useState,useEffect } from 'react'
interface Idata{
    success: boolean,
    redirect: boolean,
    email: string,
    message: string
}
const Test:React.FC = () => {
    const [email, setEmail] = useState<string>('');
    useEffect(()=>{
        fetch('/test')
        .then((res) => res.json())
        .then((data: Idata)=>{
             console.log(data)
             setEmail(data.email)
    })
    },[])
  return (
    <div id='test'>
      <h1>{email}</h1>
    </div>
  )
}

export default Test
