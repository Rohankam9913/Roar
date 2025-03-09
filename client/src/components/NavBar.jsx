import { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import { useChatContext } from "../context/chatContext";

const NavBar = () => {
  const [topNav, setTopNav] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useChatContext();

  const logout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/logout_user", {
        method: "DELETE",
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

      localStorage.removeItem("userInfo");
      setUser("");
      navigate("/auth/login");
    }
    catch (error) {
      console.log(error.message);
    }
  }

  return (
    <>
      <nav className="nav">
        <div className="left_nav" style={{cursor: "pointer"}} onClick={() => navigate("/")}>
          <img src="logo.svg" alt="logo" height={"24vw"} />
        </div>

        <div className="right_nav">

          {
            user &&
            <>
              <NavLink to={"/chat"} className={"links"}>Chats</NavLink>
              <NavLink to={"/search"} className={"links"}>Search</NavLink>
              <NavLink to={`/profile/${user._id}`} className={"links"}>Profile</NavLink>
            </>
          }

          <span style={{ display: "flex", alignItems: 'center', gap: "10px" }}>
            {
              user ? <button className="btn" onClick={() => logout()}>Log out</button>
                :
                <>
                  <button className="btn" onClick={() => navigate("/auth/login")}>Log in</button>
                  <button className="btn" onClick={() => navigate("/auth/register")}>Create Account</button>
                </>
            }

          </span>
        </div>

        <div className="hamburger" onClick={() => setTopNav(!topNav)}>
          <div></div>
          <div></div>
          <div></div>
        </div>
      </nav>

      <hr className="line" />

      {
        topNav &&
        <div className="top_nav">
          <NavLink to={"/search"} className={"links"} onClick={() => setTopNav(false)}>Search</NavLink>
          <NavLink to={`/profile/${user._id}`} className={"links"} onClick={() => setTopNav(false)}>Profile</NavLink>
          {

            !user ?
              <>
                <NavLink to={"/auth/login"} className={"links"} onClick={() => setTopNav(false)}>Login</NavLink>
                <NavLink to={"/auth/register"} className={"links"} onClick={() => setTopNav(false)}>Register</NavLink>
              </>
              :
              <button style={{ background: "transparent", border: "none", cursor: "pointer" }} className="links" onClick={() => logout()}>Logout</button>
          }


        </div>
      }
    </>
  )
}

export default NavBar;