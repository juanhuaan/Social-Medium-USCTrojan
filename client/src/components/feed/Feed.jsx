import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username, searchTag, profile, timeLine, homePage}) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  // console.log('Feed username', username)
  // console.log('Feed searchTag', searchTag)
  
  // timeLine 
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/posts/timeline/" + user._id);
        //: await axios.get("/posts/homepage/" + user._id);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    if(timeLine === true) fetchPosts();
  }, [timeLine]);

  // profile  
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
            ? await axios.get("/posts/profile/" + username)
            : await axios.get("/posts/timeline/" + user._id);
        //: await axios.get("/posts/homepage/" + user._id);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, profile]);


  // homepage feed 
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
       // : await axios.get("/posts/timeline/" + user._id);
        : await axios.get("/posts/homepage/" + user._id);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    if(homePage === true)fetchPosts();
  }, [username, user._id, homePage]);

  // search function
  useEffect(() => {
    const fetchPosts = async () => {
      // const res = await axios.get("/posts/timeline/" + user._id);
      const res = await axios.get("/posts/homepage/" + user._id);
      let allPosts = res.data;
      if (!!searchTag) {
        allPosts = allPosts.filter(p => p.tags.includes(searchTag) || p.desc.includes(searchTag));
      }
      setPosts(
        allPosts.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    if (!!user) {
      fetchPosts();
    }
    // console.log('change searchTag', searchTag)
  }, [searchTag]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {((!username || username === user.username) && ( profile!== true)) && <Share setPosts = {setPosts}/> }
        {posts.map((p) => (
          <Post key={p._id} post={p} setPosts = {setPosts}/>
        ))}
      </div>
    </div>
  );
}
