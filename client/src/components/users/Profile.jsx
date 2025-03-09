import { useNavigate, useParams } from "react-router";
import "./profile.css";
import { useEffect, useState } from "react";
import { useChatContext } from "../../context/chatContext";
import { formatDate, getName } from "../../utils/utility";

const Profile = () => {
  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState();
  const { user, setUser } = useChatContext();
  const [save, setSave] = useState(false);
  const [date, setDate] = useState();
  const navigate = useNavigate();

  const getUserProfile = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/user_profile/${userId}`, { credentials: "include" });
      const data = await response.json();

      if (data.error === "Unauthorized user") {
        localStorage.removeItem("userInfo");
        setUser("");
        navigate("/auth/login");
      }

      if (data.error) {
        throw new Error(data.error);
      }

      setUserDetails(data);

      setDate(new Date(data.DOB).toISOString().substring(0, 10));
    }

    catch (error) {
      console.log(error.message);
    }
  }

  const update = () => {
    const input = document.querySelectorAll(".input");
    setSave(true);

    for (let i = 0; i < 3; i++) {
      input[i].removeAttribute("readOnly");
    }
  }

  const cancel = () => {
    const input = document.querySelectorAll(".input");

    for (let i = 0; i < 3; i++) {
      input[i].setAttribute("readonly", true);
    }

    setSave(false);
  }

  const updateProfile = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/update_profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id: userId, DOB: date, status: userDetails.status, username: userDetails.username }),
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

      cancel();
      setUserDetails(data);
    }
    catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    getUserProfile();
  }, [])

  return (

    <div className="profile">
      {
        userDetails &&
        <>
          <h2 className="profile_heading">{getName(userDetails.username)}'s Profile </h2>
          <span style={{fontFamily: "cursive", fontSize:"18px",color: "#444"}}>Joined on - {formatDate(userDetails.createdAt)}</span>

          <div className="profile_div">
            <label htmlFor="username" className="label">Username</label>
            <input type="text" id="username" className="input" readOnly value={userDetails.username} onChange={(e) => setUserDetails({ ...userDetails, username: e.target.value })} />
          </div>

          <div className="profile_div">
            <label htmlFor="dob" className="label">Date of Birth</label>
            <input type="date" id="dob" className="input" readOnly value={date} onChange={(e) => { setDate(e.target.value) }} />
          </div>

          <div className="profile_div">
            <label htmlFor="status" className="label">status</label>
            <input type="status" id="status" className="input" readOnly value={userDetails.status} onChange={(e) => setUserDetails({ ...userDetails, status: e.target.value })} />
          </div>

          {
            userDetails._id === user._id ?
              <div className="button_section">
                {
                  !save ?
                    <>
                      <button className="update_btn" onClick={() => update()}>update</button>
                    </>
                    : <button className="update_btn" onClick={() => updateProfile()}>Save</button>
                }

                {save ? <button className="cancel_btn" onClick={() => cancel()}>Cancel</button> : ""}
              </div>
              :
              ""
          }
        </>
      }
    </div>
  )
}

export default Profile;