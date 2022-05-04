import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";
import "./home.css"
import { useState, useEffect } from "react";

export default function Home() {
  const [searchTag, setSearchTag] = useState(null);

  return (
    <>
      <Topbar setSearchTag={setSearchTag} />
      <div className="homeContainer">
        <Sidebar />
        <Feed searchTag={searchTag} />
        <Rightbar />
      </div>
    </>
  );
}
