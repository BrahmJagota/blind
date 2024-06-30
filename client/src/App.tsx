import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Socket, io  } from 'socket.io-client';
import Chat from './components/Chat';
import Home from './components/Home';
import { Home as PHome } from './pages/Home';
import Login from './components/authentication/Login';
import { ThreadsContextProvider } from './components/context/ThreadsContext';
import Navbar from './components/Navbar';
import VerifyOtp from './components/utilities/VerifyOtp';
import { UserContextProvider } from './components/context/UserContext';
import { useUserContext } from './components/context/UserContext'; 
import OTP from './components/authentication/OTP';
import Test from './components/test/Test';
import { UtilityContextProvider } from './components/context/UtilityContext';
const socket: Socket = io('http://localhost:5000');

function App() {
  
  return (
    <UserContextProvider>
    <ThreadsContextProvider>
    <UtilityContextProvider>
    <BrowserRouter>
    {/* <Navbar /> */}
    <Routes>
      {/* <Route path="/" element={ <Home socket={socket}/> }/>   */}
      <Route path="/" element={ <PHome /> }/>  
      <Route path="/:roomName/:roomId" element={ <Chat socket={socket} /> }/>  
      <Route path="/login" element={ <Login /> } />
      <Route path="/verify" element={ <OTP/> } />
      <Route path="/test" element={ <Test/> } />
      {/* <Route path="/navbar" element={ <Navbar /> } /> */}
    </Routes>
    </BrowserRouter>
    </UtilityContextProvider>
    </ThreadsContextProvider>
    </UserContextProvider>
  );
}

export default App;
