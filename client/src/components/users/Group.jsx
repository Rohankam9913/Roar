import { useCallback, useEffect, useRef, useState } from "react";
import "./profile.css";
import { useChatContext } from "../../context/chatContext";
import { useNavigate } from "react-router";

const Group = () => {
  const [users, setUsers] = useState([]);
  const [chatName, setChatName] = useState("");
  const [user, setUser] = useState("");
  const { chats, setChats } = useChatContext();
  const [members, setMembers] = useState([]);

  const navigate = useNavigate();
  
  const getAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/get_all_users", {
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

  const filterList = useCallback((users, user) => {
    return users.filter((names) => names.username.toLowerCase().match(user));
  }, [user]);

  const createGroup = async () => {
    if(members.length < 1 && chatName.length === 0){
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/chats/create_group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatName, members }),
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

  const addUserToList = (u,ind) => {
    const userName = document.getElementById(`user_${ind}`);

    if(members.includes(u._id)){
      let new_list = members.filter((member) => member._id === u._id);
      userName.style.color = "#555";
      setMembers(new_list);
      return;
    }

    userName.style.color = "red";
    setMembers([...members, u._id]);
  }

  useEffect(() => {
    getAllUsers();
  }, []);

  return (
    <div className="group">
      <div className="group_header">
        <h2 className="profile_heading">Create a new group</h2>
        <button className="group_create_btn" onClick={() => createGroup()}>Create</button>
      </div>

      <div className="profile_div">
        <label htmlFor="group_name" className="label group_label">Group Name</label>
        <input type="text" id="group_name" className="input" value={chatName} onChange={(e) => setChatName(e.target.value)} />
      </div>

      <div className="profile_div">
        <label htmlFor="users" className="label group_label">Search User</label>
        <input type="text" id="users" className="input" value={user} onChange={(e) => setUser(e.target.value)} />
      </div>

      {
        users && users.length > 0 && filterList(users, user).map((u,ind) =>
          <div className="users_list" key={u._id} >
            <h2 onClick={()=>addUserToList(u,ind)} id={`user_${ind}`}>{u.username}</h2>
          </div>
        )
      }
    
    </div>
  )
}

export default Group;