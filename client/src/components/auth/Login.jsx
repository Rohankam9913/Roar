import { useState } from "react";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/users/login_user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      localStorage.setItem("userInfo", JSON.stringify(data));
      navigate("/");
    }
    catch (error) {
      setError(error.message);
      console.log(error.message);
    }
  }

  return (
    <div className="auth">
      <div className="auth_left">
        <h2>Welcome back</h2>

        <div className="label_div">
          <label htmlFor="email" className="label">Email</label>
          <input type="email" id="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="label_div">
          <label htmlFor="password" className="label">Password</label>
          <input type="password" id="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button className="auth_btn btn" onClick={() => handleSubmit()}>Login</button>

        <p className="to">Don't have an account ? <Link to="/auth/register">Register</Link></p>

        <p className="error"> {error} </p>
      </div>

      <div className="auth_right">
        <img src="auth.png" alt="auth" className="image auth_img" />
      </div>
    </div>
  )
}

export default Login;