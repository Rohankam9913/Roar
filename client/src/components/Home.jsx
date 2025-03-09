import { useNavigate } from "react-router";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="home">

      <div className="top_home">
        <h2>Welcome to <span style={{color: "seagreen"}}>Roar</span></h2>
        <h4>An application which lets you convey your messages to anyone in real time.</h4>

        <button className="btn home_btn" onClick={()=>navigate("/chat")}>Explore</button>
      </div>

      <div className="down_home">
        <img src="pic1.png" alt="Picture1" className="image"/>
      </div>

    </div>
  )
}

export default Home;