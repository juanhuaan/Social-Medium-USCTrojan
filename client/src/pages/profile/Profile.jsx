import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

export default function Profile({socket}) {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [profileUser, setProfileUser] = useState({});
  const { user: currentUser, dispatch } = useContext(AuthContext);
  // const [profilePicName, setProfilePicName] = useState("person/noAvatar.png");
  const [profilePicName, setProfilePicName] = useState("person/noAvatar.png");
  const [coverPicName, setCoverPicName] = useState("person/noCover.png")
  const username = useParams().username;
  const [profile, setProfile] = useState(true);
  const [searchTag, setSearchTag] = useState(null);
  const [homePage, setHomePage] = useState(false);
  const [timeLine, setTimeLine] = useState(false);
  const [user, setUser] = useState(currentUser);

  // console.log('user: ', currentUser)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setProfileUser(res.data);
      setProfilePicName(res.data.profilePicture ? res.data.profilePicture : "person/noAvatar.png");
      setCoverPicName(res.data.coverPicture ? res.data.profilePicture : "person/noCover.png");
    };
    fetchUser();
  }, [username, user]);

  const uploadFile = async (imgFile, imgType, fileName) => {
    const data = new FormData();
    data.append("name", fileName);
    data.append("file", imgFile);
    try {
      await axios.post("/upload", data);
      let updateInfo = {
        "userId": currentUser._id
      };
      updateInfo[imgType] = fileName;
      console.log('updateInfo', updateInfo)
      await axios.put("/users/" + currentUser._id, updateInfo);
      const type = imgType === "coverPicture" ? 'UPDTAECPVER' : 'UPDTAEAVATAR'
      dispatch({ type: type, payload: fileName })
      console.log("Upload Successfully");
    } catch (err) {
      console.log(err);
    }
  }

  const isCurUser = () => {
    // cannot have two users who share the same name
    return currentUser.username === username;
  }

  return (
    <>
      <Topbar setSearchTag={setSearchTag} setHomePage={setHomePage} setTimeLine={setTimeLine} socket={socket}/>
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="coverAvatar">
              <div className={`changeCover ${isCurUser() ? "changable" : ""}`}>
                <img
                  className={`profileCoverImg`}
                  src={PF + coverPicName}
                  alt=""
                />
                {
                  isCurUser() &&
                  (<>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="cover"
                      accept=".png,.jpeg,.jpg"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        const fileName = Date.now() + file.name
                        await uploadFile(file, "coverPicture", fileName);
                        setCoverPicName(file.name);

                      }}
                    />
                    <label className="coverLabel" htmlFor="cover"></label>
                  </>)
                }
              </div>

              <div className={`changeAvatar ${isCurUser() ? "changable" : ""}`}>
                <img
                  className={`profileAvatarImg`}
                  src={PF + profilePicName}
                  alt=""
                />{
                  isCurUser() &&
                  (<>
                    <input
                      style={{ display: "none" }}
                      type="file"
                      id="avatar"
                      accept=".png,.jpeg,.jpg"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        const fileName = Date.now() + file.name
                        await uploadFile(file, "profilePicture", fileName);
                        setProfilePicName(fileName);
                      }}
                    />
                    <label className="avatarLabel" htmlFor="avatar"></label>
                  </>)
                }

              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{profileUser.username}</h4>
              <span className="profileInfoDesc">{profileUser.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed searchTag={searchTag} homePage={homePage} timeLine={timeLine} username={username} profile={profile} socket={socket}/>
            {/* <Feed username={username} profile={profile} /> */}
            <Rightbar user={profileUser} setUser={setUser} socket={socket}/>
          </div>
        </div>
      </div>
    </>
  );
}
