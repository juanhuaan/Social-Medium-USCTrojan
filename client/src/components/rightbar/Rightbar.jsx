import "./rightbar.css";
import { Users } from "../../dummyData";
import Online from "../online/Online";
import EditIcon from '@mui/icons-material/Edit';
import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Add, Remove } from "@material-ui/icons";
//import { Edit } from "client/src/components/edit/Edit.jsx";

export default function Rightbar({ user, setUser, socket }) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const username = useRef();
  const city = useRef();
  const from = useRef();
  const desc = useRef();
  const relationship = useRef();
  const oldPassword = useRef();
  const password = useRef();
  const [friends, setFriends] = useState([]);
  const { user: currentUser, dispatch } = useContext(AuthContext);
  const [followed, setFollowed] = useState(
    currentUser.followings.includes(user?._id)
  );



  useEffect(() => {
    const getFriends = async () => {
      try {
        const friendList = await axios.get("/users/friends/" + user._id);
        setFriends(friendList.data);
      } catch (err) {
        console.log(err);
      }
    };
    getFriends();
    setFollowed(currentUser.followings.includes(user?._id));
  }, [user]);

  const submitHandler = async () => {
    const userEdit = {
      //username: username.current.value || user.username,
      userId: user._id,
      desc: desc.current.value || user.desc,
      from: from.current.value || user.from,
      city: city.current.value || user.city,
      relationship: relationship.current.value || user.relationship,
      password: password.current.value,
      oldPassword: oldPassword.current.value

    };
    console.log('relationship', relationship)
    const updatedUser = {
      ...user,
      userEdit,
    }
    setUser(updatedUser)
    console.log(userEdit.userId)
    try {
      const res = await axios.put("/users/" + user._id, userEdit);
      console.log(res);
      dispatch({ type: 'UPDATEUSER', payload: userEdit })
      setUser(currentUser);
      // window.location.reload();
      console.log("Upload Successfully");

      desc.current.value = null;
      from.current.value = null;
      city.current.value = null;
      relationship.current.value = null;
      if (userEdit.password) {
        await logout();
      }
      password.current.value = null;
      oldPassword.current.value = null

      //await logout();
    } catch (err) {
      console.error(err)
    }
  }

  const logout = async () => {
    // console.log(user)
    dispatch({ type: "LOG_OUT" })
    // console.log(user)
    try {
      await axios.get("/");
    } catch (err) { console.log(err) }
  };


  const handleClick = async () => {
    try {
      if (followed) {
        await axios.put(`/users/${user._id}/unfollow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "UNFOLLOW", payload: user._id });
      } else {
        await axios.put(`/users/${user._id}/follow`, {
          userId: currentUser._id,
        });
        dispatch({ type: "FOLLOW", payload: user._id });
      }
      setFollowed(!followed);
      if(!followed) {
        socket.emit("sendFollowNotification", {
            senderName: currentUser.username,
            receiverId: user._id
        });
      }

    } catch (err) {
      console.error(err)
    }
  };

  const HomeRightbar = () => {
    return (
      <>
        <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Pola Foster</b> and <b>3 other friends</b> have a birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/usc.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };

  const ProfileRightbar = () => {
    return (
      <>
        {user.username !== currentUser.username && (
          <button className="rightbarFollowButton" onClick={handleClick}>
            {followed ? "Unfollow" : "Follow"}
            {followed ? <Remove /> : <Add />}
          </button>
        )}


        {user.username === currentUser.username &&
          (
            <div className="edit">
              <form className="profileForm">
                {/* <div className = "formInfo">
                <label for="username">Username: </label>
                    <input
                    placeholder={ "Username: " + user.username }
                    className="profileInput"
                    type="text"
                    ref={username || user.username}
                    />
                </div> */}
                <div className="formInfo">
                  <label for="description">Description: </label>
                  <input
                    placeholder={(user.desc || "")}
                    type="text"
                    className="profileInput"
                    ref={desc || user.desc}
                    autoComplete="text"
                  />
                </div>
                <div className="formInfo">
                  <label for="City">City: </label>
                  <input
                    placeholder={(user.city || "")}
                    type="text"
                    className="profileInput"
                    ref={city || currentUser.city}
                    autoComplete="text"
                  />
                </div>
                <div className="formInfo">
                  <label for="From">From: </label>
                  <input
                    placeholder={(user.from || "")}
                    type="text"
                    className="profileInput"
                    ref={from || user.from}
                    autoComplete="text"
                  />
                </div>
                <div className="formInfo">
                  <label for="relationship">Relationship: </label>
                  <input
                    placeholder={"input 1/2 "}
                    type="text"
                    className="profileInput"
                    ref={relationship || user.relationship}
                    autoComplete="text"
                  />
                </div>
                <div className="formInfo">
                  <label for="oldPassword">old password: </label>
                  <input
                    placeholder={"****** "}
                    type="password"
                    className="profileInput"
                    ref={oldPassword}
                    autoComplete="text"
                  />
                </div>
                <div className="formInfo">
                  <label for="password"> new password: </label>
                  <input
                    placeholder={"****** "}
                    type="password"
                    className="profileInput"
                    ref={password}
                    autoComplete="text"
                  />
                </div>
              </form>

              <button className="editButton" type="submit" onClick={submitHandler}>
                <EditIcon fontSize="small" />
              </button>
            </div>)}




        <h4 className="rightbarTitle">User information</h4>
        <div className="rightbarInfo">
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">City:</span>
            <span className="rightbarInfoValue">{user.city}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">From:</span>
            <span className="rightbarInfoValue">{user.from}</span>
          </div>
          <div className="rightbarInfoItem">
            <span className="rightbarInfoKey">Relationship:</span>
            <span className="rightbarInfoValue">
              {user.relationship === 1
                ? "Single"
                : user.relationship === 2
                  ? "Married"
                  : "-"}
            </span>
          </div>
        </div>
        <h4 className="rightbarTitle">User friends</h4>
        <div className="rightbarFollowings">
          {friends.map((friend) => (
            <Link
              to={"/profile/" + friend.username}
              style={{ textDecoration: "none" }}
            >
              <div className="rightbarFollowing">
                <img
                  src={
                    friend.profilePicture
                      ? PF + friend.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                  className="rightbarFollowingImg"
                />
                <span className="rightbarFollowingName">{friend.username}</span>
              </div>

            </Link>
          ))}
        </div>
      </>
    );
  };
  return (
    <div className="rightbar">
      <div className="rightbarWrapper">
        {user ? <ProfileRightbar /> : <HomeRightbar />}
      </div>
    </div>
  );
}
