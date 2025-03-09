import { Route, Routes } from "react-router";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Home from "./components/Home";
import NavBar from "./components/NavBar";
import "./main.css";
import ChatPage from "./components/chat/ChatPage";
import Search from "./components/chat/Search";
import Profile from "./components/users/Profile";
import Group from "./components/users/Group";
import GroupProfile from "./components/users/GroupProfile";
import AddUsers from "./components/users/AddUsers";

// For sockets
const App = () => {
  return (
    <div className="container">


      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/register" element={<Register />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/search" element={<Search />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/group" element={<Group />} />
        <Route path="/group_profile/:groupId" element={<GroupProfile />} />
        <Route path="/group/add_user/:groupId" element={<AddUsers />} />
      </Routes>
    </div>
  )
}

export default App;