import "./message.css";
import { format } from "timeago.js";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";
import { useEffect, useState } from "react";

export default function Message({ message, senderId }) {

  const { user : currentUser } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await axios("/users?userId=" + senderId);
        setUser(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    if(senderId !== currentUser._id) {
      getUser();
    }
    
  }, []);

  return (
    <div className={(senderId === currentUser._id )? "message own" : "message"}>
      <div className="messageTop">
        {(senderId !== currentUser._id ) &&
          <img
            className="messageImg"
            src= { (user?.profilePicture ? PF + user.profilePicture  : PF + "person/noAvatar.png") } 
            alt=""
          />}
        <p className="messageText">{message.text}</p>
        {(senderId === currentUser._id ) &&
          <img
            className="messageMyImg"
            src= { (currentUser.profilePicture ? PF + currentUser.profilePicture : PF + "person/noAvatar.png") } 
            alt=""
          />}
      </div>
      <div className="messageBottom">{format(message.createdAt)}</div>
    </div>
  );
}
