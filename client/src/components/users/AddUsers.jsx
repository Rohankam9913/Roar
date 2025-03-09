import { useState } from "react";
import { useChatContext } from "../../context/chatContext";
import { Link, useNavigate, useParams } from "react-router";

const AddUsers = () => {
  const [users, setUsers] = useState([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState(""); 
  const navigate = useNavigate();
  const { setUser } = useChatContext();

  const { groupId } = useParams();

  const searchUsers = async () => {
    if (input.length === 0)
      return;

    setError("");

    try {
      const response = await fetch(`http://localhost:5000/api/users/search_user?search_query=${input}`, {
        method: "GET",
        credentials: "include"
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data);
    }
    catch (error) {
      alert(error.message);
    }
  }

  const addUserToGroup = async (user) => {
    try {
      const response = await fetch("http://localhost:5000/api/chats/add_user", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id, chatId: groupId }),
        credentials: "include"
      });

      const data = await response.json();

      if (data.error === "Unauthorized user") {
        localStorage.removeItem("userInfo");
        setUser("");
        navigate("/auth/login");
      }

      if (data.error) {
        // setError(data.error);
        alert(data.error);

        throw new Error(data.error);
      }

      navigate(`/group_profile/${groupId}`);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  return (
    <div className="search">

      <div style={{marginBottom: "20px", textAlign: "center"}}>
        <h3 style={{fontFamily: "helvetica", color: "#555"}}>Add Users</h3>
      </div>

      <div className="input_group">
        <input type="text" className="search_input" value={input} onChange={(e) => setInput(e.target.value)} />
        <button className="go" onClick={() => searchUsers()}>Search</button>
      </div>

      {
        users && users.length > 0 && users.map((user) =>
          <div className="chat" style={{ marginTop: "20px", width: "fit-content" }} key={user._id} onClick={() => addUserToGroup(user)}>
            <div className="avtar">
              <span>R</span>
              <h3>{user.username}</h3>
            </div>
          </div>
        )
      }

      {error ? <h2 className="error">{ error }</h2> : ""}

    </div>
  )
}

export default AddUsers;