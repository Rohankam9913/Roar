import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState();
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState();
  const [messages, setMessages] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const userInfo = localStorage.getItem("userInfo");
  useEffect(() => {

    if (location.pathname === "/auth/register") {
      navigate("/auth/register");
      return;
    }

    if (!userInfo) {
      navigate("/auth/login");
      return;
    }

    setUser(JSON.parse(userInfo));
  }, [location.pathname]);

  return (
    <ChatContext.Provider value={{ chats, setChats, user, setUser, selectedChat, setSelectedChat, messages, setMessages }}>
      {children}
    </ChatContext.Provider>
  )
}

export const useChatContext = () => {
  return useContext(ChatContext);
}

export default ChatProvider;