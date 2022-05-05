import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router";


export default function Profile() {
  const PF = process.env.REACT_APP_PUBLIC_FOLDER;
  const [user, setUser] = useState({});
  const [profilePicture, setProfilePicture] = useState(null);
  const [coverPicture, setCoverPicture] = useState(null);
  const username = useParams().username;
  const [profile, setProfile] = useState(true);
  const [searchTag, setSearchTag] = useState(null);
  const [homePage, setHomePage] = useState(false);
  const [timeLine, setTimeLine] = useState(false);

  console.log('coverPicture', coverPicture)

  useEffect(() => {
    const fetchUser = async () => {
      const res = await axios.get(`/users?username=${username}`);
      setUser(res.data);
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const updateFile = async () => {
      const data = new FormData();
      const fileName = Date.now() + profilePicture.name;
      data.append("name", fileName);
      data.append("file", profilePicture);
      try {
        await axios.post("/upload", data);
        user.profilePicture = fileName;
        const updateInfo = {
          "userId": user._id,
          "profilePicture": fileName
        };
        await axios.put("/users/" + user._id, updateInfo);
        window.location.reload();
      } catch (err) { }
    }
    if (!!profilePicture) {
      updateFile();
    }
  }, [profilePicture]);
  useEffect(() => {
    const updateFile = async () => {
      const data = new FormData();
      const fileName = Date.now() + coverPicture.name;
      data.append("name", fileName);
      data.append("file", coverPicture);
      try {
        await axios.post("/upload", data);
        user.coverPicture = fileName;
        const updateInfo = {
          "userId": user._id,
          "coverPicture": fileName
        };
        await axios.put("/users/" + user._id, updateInfo);
        window.location.reload();
      } catch (err) { }
    }
    if (!!coverPicture) {
      updateFile();
    }
  }, [coverPicture]);

  return (
    <>
      <Topbar setSearchTag={setSearchTag} setHomePage={setHomePage} setTimeLine={setTimeLine} />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="coverAvatar">
              <div className="changeCover">
                <img
                  className="profileCoverImg"
                  src={
                    user.coverPicture
                      ? PF + user.coverPicture
                      : PF + "person/noCover.png"
                  }
                  alt=""
                />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="cover"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => { setCoverPicture(e.target.files[0]) }}
                />
                <label className="coverLabel" htmlFor="cover"></label>
              </div>

              <div className="changeAvatar">
                <img
                  className="profileAvatarImg"
                  src={
                    user.profilePicture
                      ? PF + user.profilePicture
                      : PF + "person/noAvatar.png"
                  }
                  alt=""
                />
                <input
                  style={{ display: "none" }}
                  type="file"
                  id="profile"
                  accept=".png,.jpeg,.jpg"
                  onChange={(e) => { setProfilePicture(e.target.files[0]) }}
                />
                <label className="avatarLabel" htmlFor="avatar"></label>
              </div>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed searchTag={searchTag} homePage={homePage} timeLine={timeLine} username={username} profile={profile} />
            {/* <Feed username={username} profile={profile} /> */}
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
