import { useEffect, useState } from "react";
import "./profile.css";
import { NavLink, useNavigate, useParams } from "react-router";
import { useChatContext } from "../../context/chatContext";
import { formatDate } from "../../utils/utility";

const GroupProfile = () => {
  const { groupId } = useParams();
  const [groupDetails, setGroupDetails] = useState();
  const { user, setUser } = useChatContext();
  const navigate = useNavigate();

  const getUserDetails = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/chats/get_group_details/${groupId}`, {
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

      setGroupDetails(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const renameGroup = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/chats/rename_chat", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newChatName: groupDetails.chatName, chatId: groupId }),
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

      setGroupDetails(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  const leaveGroup = async (member) => {
    try {
      if(member !== groupDetails.admin._id){
        let ans = confirm("Are you sure you want to remove this user from the group ?");
        if(!ans) return;
      }

      let ans = confirm("Are you sure you want to leave the group ?");
      if(!ans) return;

      const response = await fetch("http://localhost:5000/api/chats/remove_user", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId: groupDetails._id, userId: member }),
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

      setGroupDetails(data);
    }
    catch (error) {
      alert(error.message);
      console.log(error.message);
    }
  }

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="profile">

      {
        groupDetails &&
        <>
          <h2 className="profile_heading">Coder's Group</h2> <span style={{fontFamily: "cursive", fontSize:"18px",color: "#444"}}>created on - {formatDate(groupDetails.createdAt)}</span>
          <NavLink to={`/group/add_user/${groupDetails._id}`} className={"links"} style={{ color: "green", fontWeight: "bold" }}>Add User</NavLink>

          <div className="profile_div">
            <label htmlFor="chat_name" className="label ">Group Name</label>
            <input type="text" id="chat_name" className="input" value={groupDetails.chatName} onChange={(e) => setGroupDetails({ ...groupDetails, chatName: e.target.value })} />
            <button className="rename" onClick={() => renameGroup()}>Rename</button>
          </div>

          <div className="profile_div">
            <label htmlFor="chat_name" className="label">Users</label>
            {
              groupDetails.members?.map((member) =>
                <div className="users_list users" key={member._id} >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <h2>{member.username}</h2> {groupDetails.admin._id === member._id ? <span>(Admin)</span> : ""}

                    {member._id === user._id || groupDetails.admin._id === user._id ? <button className="leave_btn" onClick={() => leaveGroup(member._id)}>Leave</button> : ""}

                  </div>
                </div>
              )
            }
          </div>


        </>
      }
    </div>
  )
}

export default GroupProfile;