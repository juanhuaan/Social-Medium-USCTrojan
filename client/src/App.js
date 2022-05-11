import Home from './pages/home/Home'
import Login from './pages/login/Login'
import Profile from './pages/profile/Profile'
import Register from './pages/register/Register'

import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './context/AuthContext'
import Messenger from './pages/messenger/Messenger'
import { io } from "socket.io-client";
import { useState, useEffect } from "react";

function App() {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    setSocket(io("http://chat-env-v6.eba-zsgzc3my.us-west-2.elasticbeanstalk.com"));
  }, []);

  useEffect(() => {
    socket?.emit("addUser", user?._id);
    socket?.on("getUsers", (users) => {
      // setOnlineUsers(
      //   user.followings.filter((f) => users.some((u) => u.userId === f))
      // );
      // console.log(users)
    });
  }, [socket, user]);

  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {user ? <Home socket={socket}/> : <Login />}

          {/* {user ? <Home /> : <Register />} */}
        </Route>
        <Route path="/login">{user ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/register">{user ? <Redirect to="/" /> : <Register />}</Route>
        <Route path="/messenger">{!user ? <Redirect to="/" /> : <Messenger socket={socket}/>}</Route>
        <Route path="/profile/:username"> {user ? <Profile socket={socket}/> : <Redirect to="/" />} </Route>
      </Switch>
    </Router>
  )
}

export default App
