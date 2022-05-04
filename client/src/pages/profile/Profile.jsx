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
  const [profilePicture, setprofilePicture] = useState(null);
  const [coverPicture, setcoverPicture] = useState(null);
  const username = useParams().username;
  const [profile, setProfile] = useState(true);

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
      <Topbar />
      <div className="profile">
        <Sidebar />
        <div className="profileRight">
          <div className="profileRightTop">
            <div className="profileCover">
              <label htmlFor="cover" className="changePicture">
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
                  onChange={(e) => { setcoverPicture(e.target.files[0]) }}
                />
              </label>
              <label htmlFor="profile" className="changePicture">
                <img
                  className="profileUserImg"
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
                  onChange={(e) => { setprofilePicture(e.target.files[0]) }}
                />
              </label>
            </div>
            <div className="profileInfo">
              <h4 className="profileInfoName">{user.username}</h4>
              <span className="profileInfoDesc">{user.desc}</span>
            </div>
          </div>
          <div className="profileRightBottom">
            <Feed username={username} profile={profile} />
            <Rightbar user={user} />
          </div>
        </div>
      </div>
    </>
  );
}
