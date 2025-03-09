import { Link, useNavigate } from "react-router";
import { useChatContext } from "../../context/chatContext";
import { findChatName, findId, formatDate, formatTime } from "../../utils/utility";
import "./messages.css";
import { Fragment, useEffect, useRef, useState } from "react";

// socket io
import { socket } from "../../socket";

const MessageContaier = ({ notify, setNotify }) => {
  const { selectedChat,user, messages, setMessages } = useChatContext();
  const [content, setContent] = useState("");
  const navigate = useNavigate();

  // Auto scrolling feature
  const ref = useRef();
  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  },[messages]);
  
  
  const sendMessage = async (e) => {
    try {
      e.preventDefault();

      if (content === "") {
        return;
      }

      setContent("");

      const response = await fetch("http://localhost:5000/api/messages/send_message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, chatId: selectedChat._id }),
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

      setNotify(!notify);
      socket.emit("msg", data);
      setMessages([...messages, data]);

    }
    catch (error) {
      console.log(error.message);
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/messages/fetch_messages/${selectedChat?._id}`, {
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
        setMessages([]);
        throw new Error(data.error);
      }
    
      setMessages(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  // Socket
  useEffect(() => {
    socket.connect();

    // Joining the room
    socket.emit("room", selectedChat._id);

    // Recieving the message from the server
    socket.on("msg", content => {
      setNotify(!notify);
      setMessages([...messages, content]);
    })

    return () => {
      socket.disconnect();
    }
  }, [messages]);

  useEffect(() => {
    fetchMessages();
  }, [selectedChat]);

  return (
    <div className="message_container">
      {
        selectedChat &&
        <>
          <header className="header">
            <h2>{selectedChat.isGroupChat === 'true' ? selectedChat.chatName : findChatName(selectedChat, user)}</h2>

            {
              selectedChat.isGroupChat === "true" ? <Link to={`/group_profile/${selectedChat._id}`} className="info">ℹ</Link> :
                <Link to={`/profile/${findId(selectedChat, user)}`} className="info">ℹ</Link>
            }
          </header>

          <main className="messages">

            <div className="message_box" ref={ref}>

              {
                messages && messages.length > 0 && messages.map((message) =>
                  <Fragment key={message._id}>
                    {
                      message.sender._id === user._id ?
                        <div className="right_bubble">
                          <h2 className="content">{message.content}</h2>
                          <p className="time">{ formatDate(message.createdAt)} | {formatTime(message.createdAt)}</p>
                          
                        </div>
                        :
                        <div className="left_bubble">
                          <h2 className="content">{message.content}</h2>
                          <p className="time">{formatDate(message.createdAt)} | {formatTime(message.createdAt)} {selectedChat.isGroupChat === "true" ? `| ${message.sender.username}` : ""}</p>
                        </div>
                    }
                  </Fragment>

                )
              }

            </div>

            <form className="message_input_group" onSubmit={sendMessage}>
              <input type="text" className="message_input input" value={content} onChange={(e) => setContent(e.target.value)} />
            </form>
          </main>
        </>
      }
    </div>
  )
}

export default MessageContaier;