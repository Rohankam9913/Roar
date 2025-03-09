import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { getUserName } from "../../utils/utility";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    try{
      const response = await fetch("http://localhost:5000/api/users/create_user",{
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ username, email, password }),
        credentials: "include"
      });

      const data = await response.json();

      if(data.error){
        setError(data.error);
        throw new Error(data.error);
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      localStorage.setItem("welcome", JSON.stringify(getUserName(data.username)));
      navigate("/");
    }
    catch(error){
      console.log(error.message);
      setError(error.message);
    }
  }

  return (
    <div className="auth">
      <div className="auth_left">
        <h2>Create a new account</h2>

        <div className="label_div">
          <label htmlFor="username" className="label">Username</label>
          <input type="text" id="username" className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>

        <div className="label_div">
          <label htmlFor="email" className="label">Email</label>
          <input type="email" id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        <div className="label_div">
          <label htmlFor="password" className="label">Password</label>
          <input type="password" id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>

        <button className="auth_btn btn" onClick={()=>handleSubmit()}>Register</button>

        <p className="error"> {error} </p>
      </div>

      <div className="auth_right">
        <img src="auth.png" alt="auth" className="image auth_img" />
      </div>
    </div>
  )
}

export default Register;