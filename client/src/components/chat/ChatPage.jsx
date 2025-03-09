import { useState } from "react";
import MessageContaier from "../messages/MessageContainer";
import "./chat.css";
import SideBar from "./SideBar";
import { useChatContext } from "../../context/chatContext";

const ChatPage = () => {
  const [notiify, setNotify] = useState(false);
  const { selectedChat } = useChatContext();
  
  return (  
    <>
      <div className="chat_page">
        <div className="side_bar"   id="side_bar">
          <SideBar notify={notiify} setNotify={setNotify} />
        </div>


        {selectedChat &&
          <div className="chat_container">
            <MessageContaier notify={notiify} setNotify={setNotify} />
          </div>
        }
      </div>
    </>
  )
}

export default ChatPage;