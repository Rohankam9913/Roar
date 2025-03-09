import { useEffect, useRef } from "react";
import "./chat.css";
import { useChatContext } from "../../context/chatContext";
import { findChatName, stripStr } from "../../utils/utility";
import { useNavigate } from "react-router";

const SideBar = ({ notify }) => {
  const { chats, setChats, user, setUser, setSelectedChat, selectedChat } = useChatContext();
  const navigate = useNavigate();

  const ref = useRef();

  const fetchAllChats = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chats/fetch_chats", {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (data.error === "Unauthorized user") {
        localStorage.removeItem("userInfo");
        setUser("");
        navigate("/auth/login");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setChats(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    if(ref.current){
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  },[chats]);

  useEffect(() => {
    fetchAllChats();
  }, [notify]);

  useEffect(() => {

  }, []);

  return (
    <div className="sideBar" ref={ref}>
      {
        chats && chats.length > 0 && chats.map((chat) =>

          <div className={`chat ${selectedChat && selectedChat._id === chat._id ? "hightlight" : ""} `} key={chat._id} onClick={() => setSelectedChat(chat)}>
            <div className="avtar">
              <span>R</span>

              <div className="avtar_div">

                {
                  chat.isGroupChat === "true" ?
                    <h3>{chat.chatName}</h3>
                    :
                    <h3>{findChatName(chat, user)}</h3>
                }

                <p>{chat?.latestMessage?.content ? stripStr(chat?.latestMessage?.content) : ""}</p>

              </div>
            </div>
          </div>

        )
      }

    </div>
  )
}

export default SideBar;