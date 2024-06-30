import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Chats from "./Chats";
import { UserContext, useUserContext } from "./context/UserContext";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faReply , faBars} from "@fortawesome/free-solid-svg-icons";
import { useUtilityContext } from "./context/UtilityContext";
interface IchatInfo {
  message: string;
  roomId: string;
}
interface Idata {
  success: boolean,
  message: IMessage[]
}
interface IMessage {
  chat: string; 
  sendBy: string;
  sendTo: string;
}
interface IreceivedMessage {
  message: string,
  roomId: string,
  sendBy: string
}
const Chat: React.FC<IsocketProp> = ({ socket }) => {
  const { roomId } = useParams();
  const {userId} = useUserContext();
  const {isProfileModalOpen} = useUtilityContext();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMessageSet, setIsMessageSet] = useState<boolean>(false);
  const [testState, setTestState] = useState<string[]>([]);
  const [chatInfo, setChatInfo] = useState<IchatInfo>({
    message: "",
    roomId: "",
  });

  useEffect(()=> {
    fetchReq()
    console.log("roomId",JSON.stringify(roomId))
  },[])
  useEffect(()=> {
    setIsMessageSet(true);
    console.log("messages",messages)
  },[messages])
  const fetchReq = () => {
    setIsLoading(true);
    fetch('/api/load-chat', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({roomId: roomId})
     })
     .then((res) => res.json())
     .then((data: Idata) => {
        console.log("data",data)
        const allChatMessages: string[] = data.message.map((item) => item.chat);
      setIsMessageSet(false);
      setTestState(allChatMessages);
      setMessages(data.message);
      setIsLoading(false)
     })
  }

  const handleReplyChat = (chat: string) => {

  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
    const textarea = textareaRef.current;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${textarea.scrollHeight}px`;
    if (textarea.value.trim() === "") {
      textarea.style.height = '2.2rem';
    }
  }
  };

  useEffect(()=> {
    const messageContainer = messageContainerRef.current;
      if(messageContainer){
        messageContainer.scrollTop = messageContainer.scrollHeight;
        console.log(messageContainer.scrollTop)
      }
    
      console.log(messageContainer?.scrollTop)
  },[])
  useEffect(() => {
    setChatInfo({
      message: "",
      roomId: roomId ? roomId : "roomId",
    });
    socket.emit("room-joined", roomId);
  }, []);

  // receive chat
  useEffect(() => {
    const messageContainer = messageContainerRef.current;
  
    const handleReceiveChat = (receivedMessage: IMessage) => {
      setIsMessageSet(false);
      setTestState(prevTestState => [...prevTestState, receivedMessage.chat])
      setMessages(prevMessages => [...prevMessages, receivedMessage]);
      console.log("received", receivedMessage);
      
      if (messageContainer) {
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    };
  
    socket.on("receive-chat", handleReceiveChat);
  
    return () => {
      socket.off("receive-chat", handleReceiveChat);
    };
  }, [socket, messageContainerRef, setIsMessageSet, setMessages]);
  
  const handleSendMessage = () => {
    // fetch('/api/save-chat', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(chatInfo)
    // })
    // .then((res)=> res.json())
    // .then((data)=> console.log("save-chat",data))
    // .catch((err)=> console.log("chat save error", err));
    const chatData = {
      message: chatInfo.message,
      roomId: chatInfo.roomId,
      sendBy: userId
    }
    socket.emit("send-chat-to-room", chatData);
    setChatInfo({
      message: "",
      roomId: roomId ? roomId : "roomId",
    });
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setChatInfo({
      ...chatInfo,
      message: event.target.value,
    });
  };
  

  return (
    <div id="chat">
      <div className="navbar">
      <Navbar />

      </div>
      <div className="rooms-container"> 
      <Chats />
      </div>
      <div className={isProfileModalOpen? `chat-container blur` : `chat-container`}>
      <div className="display">
      <div className="messages" ref={messageContainerRef}>
      {isLoading ? (
  <div>
    <li className="list-none chat-list">No chat found</li>
  </div>
) : (
  isMessageSet ? (
    messages.map((chat, index) => (
      <div  className={userId === chat.sendBy ? 'text-right' : 'text-left '}>
        <small className={userId === chat.sendBy ? 'text-blue-400 mr-2' : 'text-blue-400 ml-2 '}>145214524</small>
      <div key={index}>
      {/* <FontAwesomeIcon icon={faReply} className="reply-icon" /> */}
        <li className="chat list-none chat-list max-w-[35rem] bg-white text-black">
          {chat.chat}
        </li>
      </div>
      
      </div>
    ))
  ) : (
    <div>
      <li className="list-none chat-list">No messages</li>
    </div>
  )
)}

      </div>
      <div className="message">
        <textarea
          ref={textareaRef}
          name="message"
          onChange={handleInputChange}
          value={chatInfo.message}
          onKeyDown={handleKeyPress}
        />{" "}
        <button className="submit" onClick={handleSendMessage} type="submit">
          Submit
        </button>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Chat;
