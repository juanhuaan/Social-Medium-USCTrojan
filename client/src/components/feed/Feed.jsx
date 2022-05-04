import { useContext, useEffect, useState } from "react";
import Post from "../post/Post";
import Share from "../share/Share";
import "./feed.css";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";

export default function Feed({ username, searchTag }) {
  const [posts, setPosts] = useState([]);
  const { user } = useContext(AuthContext);

  console.log('Feed username', username)
  console.log('Feed searchTag', searchTag)
  useEffect(() => {
    const fetchPosts = async () => {
      const res = username
        ? await axios.get("/posts/profile/" + username)
        : await axios.get("/posts/timeline/" + user._id);
      // : await axios.get("/posts/homepage/" + user._id);

      setPosts(
        res.data.sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    fetchPosts();
  }, [username, user._id]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await axios.get("/posts/timeline/" + user._id);
      // : await axios.get("/posts/homepage/" + user._id);
      setPosts(
        res.data.filter(p => p.tags.includes(searchTag) || p.desc.includes(searchTag)).sort((p1, p2) => {
          return new Date(p2.createdAt) - new Date(p1.createdAt);
        })
      );
    };
    if (!!searchTag) {
      fetchPosts();
    }
    console.log('change searchTag', searchTag)
  }, [searchTag]);

  return (
    <div className="feed">
      <div className="feedWrapper">
        {(!username || username === user.username) && <Share />}
        {posts.map((p) => (
          <Post key={p._id} post={p} />
        ))}
      </div>
    </div>
  );
}
