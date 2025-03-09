import { useState } from "react";
import "./chat.css";
import { useChatContext } from "../../context/chatContext";
import { Link, useNavigate } from "react-router";

const Search = () => {
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const { chats, setChats } = useChatContext();
  const navigate = useNavigate();
  const { setUser } = useChatContext();

  const searchUsers = async () => {
    if (input.length === 0)
      return;

    try {
      const response = await fetch(`http://localhost:5000/api/users/search_user?search_query=${input}`, {
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

      setUsers(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const createChat = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/api/chats/create_chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
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

      setChats(chats.find((chat) => chat._id !== data._id));
      navigate("/chat");
    }
    catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="search">

      <div style={{marginBottom: "20px", textAlign: "center"}}>
        <Link to={"/group"} className="links">Create Group</Link>
      </div>

      <div className="input_group">
        <input type="text" className="search_input" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="go" onClick={() => searchUsers()}>Search</button>
      </div>

      {
        users && users.length > 0 && users.map((user) =>
          <div className="chat" style={{ marginTop: "20px", width: "fit-content" }} key={user._id} onClick={() => createChat(user)}>
            <div className="avtar">
              <span>R</span>
              <h3>{user.username}</h3>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default Search;