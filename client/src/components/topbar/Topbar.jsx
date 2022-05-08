import "./topbar.css";
import { Search, Person, Chat, Notifications } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function Topbar({ setSearchTag, setHomePage, setTimeLine, socket }) {
  const { user, dispatch } = useContext(AuthContext);
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [postNotifications, setpostNotifications] = useState([]);
  const [followNotifications, setfollowNotifications] = useState([]);
  const [messageNotifications, setmessageNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const logoutHandler = async () => {
    // console.log(user)
    dispatch({ type: "LOG_OUT" })
    // console.log(user)
    try {
      await axios.get("/");
    } catch (err) { console.log(err) }
  };

  const HomepageHandler = () => {
    setHomePage(true);
    setTimeLine(false);
  }

  const TimelineHandle = () => {
    setTimeLine(true);
    setHomePage(false);
  }

  useEffect(() => {
    socket?.on("getPostNotification", (data) => {
      setpostNotifications((prev) => [...prev, data]);
    });

    socket?.on("getFollowNotification", (data) => {
      setfollowNotifications((prev) => [...prev, data]);
    });

    socket?.on("getMessageNotification", (data) => {
      setmessageNotifications((prev) => [...prev, data]);
    });
  }, [socket]);


  console.log(postNotifications)

  const displayPostNotification = ({ senderName, type }) => {
    let action;

    if (type === "like") {
      action = "liked";
    } else {
      action = "commented";
    }
    return (
      <span className="Notification">{`${senderName} ${action} your post.`}</span>
    );
  };

  const displayFollowNotification = ({ senderName }) => {

    return (
      <span className="Notification">{`${senderName} followed you.`}</span>
    );
  };

  const displayMessageNotification = ({ senderName }) => {
  
    return (
      <span className="Notification">{`${senderName} sent you a new message.`}</span>
    );
  };

  const handleRead = () => {
    setpostNotifications([]);
    setfollowNotifications([]);
    setmessageNotifications([]);
    setOpen(false);
  };

  return (
    <div className="topbarContainer">
      <div className="topbarLeft">
        <Link to="/" style={{ textDecoration: "none" }}>
          <span className="logo">Trojan Familly</span>
        </Link>
      </div>
      <div className="topbarCenter">
        <div className="searchbar">
          <Search className="searchIcon" />
          <input
            placeholder="Try searching for people, topics, or keywords"
            className="searchInput"
            onChange={(e) => { setSearchTag(e.target.value) }}
          />
        </div>
      </div>
      <div className="topbarRight">
        <div className="topbarLinks">
          <span className="topbarLink" onClick={HomepageHandler} >Homepage</span>
          <span className="topbarLink" onClick={TimelineHandle}>Timeline</span>
          <span className="topbarLink" onClick={logoutHandler}>Log Out</span>
        </div>
        <div className="topbarIcons" onClick={() => setOpen(!open)}>
          <div className="topbarIconItem">
            <Person />
            {
              followNotifications.length >0 &&
              <span className="topbarIconBadge">{followNotifications.length}</span>
            }
          </div>
          <div className="topbarIconItem" >
            <Chat />
            {
              messageNotifications.length >0 &&
              <Link to="/messenger" style={{ textDecoration: "none" }}>
                <span className="topbarIconBadge">{messageNotifications.length}</span>
              </Link>
            }
          </div>
          <div className="topbarIconItem" >
            <Notifications />
            {
              postNotifications.length >0 &&
              <span className="topbarIconBadge">{postNotifications.length}</span>
            }
          </div>
        </div>
        {open && (
          <div className="notifications">
            {postNotifications.map((n) => displayPostNotification(n))}
            {followNotifications.map((n) => displayFollowNotification(n))}
            {messageNotifications.map((n) => displayMessageNotification(n))}
            <button className="nButton" onClick={handleRead}>
              Mark as read
            </button>
          </div>
        )}
        <Link to={`/profile/${user.username}`}>
          <img
            src={
              user.profilePicture
                ? PF + user.profilePicture
                : PF + "person/noAvatar.png"
            }
            alt=""
            className="topbarImg"
          />
        </Link>
        
      </div>
      
    </div>    
    
  );
}
