import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";
import { useParams } from "react-router-dom";
import Navbar from "./Navbar";
import Chats from "./Chats";
import { UserContext, useUserContext } from "./context/UserContext";
interface IchatInfo {
  message: string;
  slug: string;
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
  slug: string,
  sendBy: string
}
const Chat: React.FC<IsocketProp> = ({ socket }) => {
  const { slug } = useParams();
  const {userId} = useUserContext();
  const messageContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isMessageSet, setIsMessageSet] = useState<boolean>(false);
  const [chatInfo, setChatInfo] = useState<IchatInfo>({
    message: "",
    slug: "",
  });

  useEffect(()=> {
    fetchReq()
    console.log("slug",JSON.stringify(slug))
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
      body: JSON.stringify({slug: slug})
     })
     .then((res) => res.json())
     .then((data: Idata) => {
        console.log("data",data)
        const allChatMessages: string[] = data.message.map((item) => item.chat);
      setIsMessageSet(false);
      setMessages(data.message);
      setIsLoading(false)
     })
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
      }
  },[])
  useEffect(() => {
    setChatInfo({
      message: "",
      slug: slug ? slug : "slug",
    });
    socket.emit("room-joined", slug);
  }, []);

  // receive chat
  useEffect(() => {
    const messageContainer = messageContainerRef.current;
    socket.on("receive-chat", (receivedMessage: IMessage) => {
      setIsMessageSet(false);
      setMessages((prevMessages) => [...prevMessages, receivedMessage]);
      console.log("received",receivedMessage);
      if(messageContainer){
        messageContainer.scrollTop = messageContainer.scrollHeight;
      }
    });

    return () => {
      socket.off("receive-chat");
    };
  }, [socket]);
  const handleSendMessage = () => {
    fetch('/api/save-chat', {
      method: 'POSt',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(chatInfo)
    })
    .then((res)=> res.json())
    .then((data)=> console.log("save-chat",data))
    .catch((err)=> console.log("chat save error", err));
    const chatData = {
      message: chatInfo.message,
      slug: chatInfo.slug,
      sendBy: userId
    }
    socket.emit("send-chat-to-room", chatData);
    setChatInfo({
      message: "",
      slug: slug ? slug : "slug",
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
      <div className="chat-container">
      <div className="display ">
      <div className="messages" ref={messageContainerRef}>
      {isLoading ? (
  <div>
    <li className="list-none chat-list">No chat found</li>
  </div>
) : (
  isMessageSet ? (
    messages.map((chat, index) => (
      <div className={userId === chat.sendBy ? 'text-right' : 'text-left'} key={index}>
        <li className="list-none chat-list">
          {chat.chat}
        </li>
      </div>
    ))
  ) : (
    <div>
      <li className="list-none chat-list">No messages set</li>
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
