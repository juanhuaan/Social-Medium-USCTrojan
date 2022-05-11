import "./post.css";
import Button from '@mui/material/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import { Collapse } from "@material-ui/core";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { Comments } from "../comments/Comments";
import { Label } from "@material-ui/icons";

export default function Post({ post, setPosts, socket }) {
    const [like, setLike] = useState(post.likes.length);
    const [isLiked, setIsLiked] = useState(false);
    const [commentNum, setcommentNum] = useState(post.comments.length);

    const [user, setUser] = useState({});

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;
    const { user: currentUser } = useContext(AuthContext);

    useEffect(() => {
        setIsLiked(post.likes.includes(currentUser._id));
    }, [currentUser._id, post.likes]);

    const [isShowingComment, setIsShowingComment] = useState(false)


    useEffect(() => {
        const fetchUser = async () => {
            const res = await axios.get(`/users?userId=${post.userId}`);
            setUser(res.data);
        };
        fetchUser();
    }, [post.userId]);

    const deleteHandler = async () => {
        try {
            await axios.delete("/posts/" + post._id, { data: { userId: currentUser._id } });
            //window.location.reload();
            setPosts(prevPosts => {
                return prevPosts.filter(prevPost => prevPost._id !== post._id);
            })
        } catch (err) { console.error(err) }
    }

    const likeHandler = () => {
        try {
            axios.put("/posts/" + post._id + "/like", { userId: currentUser._id });
        } catch (err) { }
        setLike(isLiked ? like - 1 : like + 1);
        setIsLiked(!isLiked);
        if(post.userId !== currentUser._id) {
            if(!isLiked) {
                socket.emit("sendPostNotification", {
                    // senderId: user._id,
                    senderName: currentUser.username,
                    receiverId: post.userId,
                    type:"like"
                });
            }
        } 
    };

    const formatting = (tags) => {
        let tagStr = ""
        for (let tag of tags) {
            tagStr += tag + ", ";
        }
        return tagStr.slice(0, tagStr.length - 2)
    }

    return (
        <div className="post">
            <div className="postWrapper">
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link to={`/profile/${user.username}`}>
                            <img
                                className="postProfileImg"
                                src={
                                    user.profilePicture
                                        ? PF + user.profilePicture
                                        : PF + "person/noAvatar.png"
                                }
                                alt=""
                            />
                        </Link>
                        <span className="postUsername">{user.username}</span>
                        <span className="postDate">{format(post.createdAt)}</span>
                    </div>
                    <div className="postTopRight">
                        {post.userId === currentUser._id &&
                            <Button size="small" color="error" onClick={deleteHandler}>
                                <DeleteIcon fontSize="small" /> &nbsp;  Delete
                            </Button>}
                    </div>
                </div>
                <div className="postCenter">
                    <span className="postText">{post?.desc}</span>
                    <img className="postImg" src={PF + post.img} alt="" />
                </div>

                {(post.tags[0] !== "") && <div className="postSub">
                    <Label htmlColor= "#fee682" className="tagIcon" />
                    <span className="tagText"> {formatting(post?.tags)}</span>
                </div>}
                {/* <hr className="shareHr" /> */}
                <div className="postBottom">
                    <div className="postBottomLeft">
                        <img
                            className="likeIcon"
                            src={`${PF}like.png`}
                            onClick={likeHandler}
                            alt=""
                        />
                        <img
                            className="likeIcon"
                            src={`${PF}heart.png`}
                            onClick={likeHandler}
                            alt=""
                        />
                        <span className="postLikeCounter">{like} people like it</span>
                    </div>
                    <div className="postBottomRight" onClick={() => {
                        setIsShowingComment(!isShowingComment)
                    }}>
                        <span className="postCommentText">
                            {commentNum} comment(s)
                            <img
                                className={
                                    "postCommentArrow " +
                                    (isShowingComment ? "downward" : "")
                                }
                                src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABmJLR0QA/wD/AP+gvaeTAAAB7UlEQVRIie2QT0iTcRjHv7+971uH6lAwooIOttlqcxphFBEM3R/eFljBS4FFBBV0CYROnTrUPTxKXSI6GEFZMX21HKsRJrbed8NteuigRSGEDY3Z9nueTobUnKt53Of6fb6fLzxAgwb1opy9eCXb7Gudydqp/HqK2wPB4PbdTY8Vj9eXU1Tt4R5vy2w+baXXQ37wWDBKwAOSfEmZTFsfm1vbEqpw3Hf7/PP5tDVRj/xQZ/gkEfdBlrs+JEffKACQs1KzHv+BIQf4rsvrL05l7PH/kbcHwt1EfIdJ6qlkfAIAlOUwZ6e+un1tgw5Qn8uzX5uezCT/Sd6hX2XmW0KIyPvEy9+vVlYeTWWsuSbXvqdQ1V73Xu+W6WwmUYv8cOfxa2C6rkJ0vIubuZWZqFQ4YRi7iNWRclkOmk/6e6rL9RsMvkAKBcdNc+bPvOIAAEROn9vBKA1zmUaGBx71AOC/5KHobRCdEqyE3r56/qmSZ9UBAIgYxjb5E0OSyR4daLkM3KTl3pFQtJeJjmobEHkdi82t5qg6AAABw9js+CFfSNAXsTjf7XQ6+fP34j3ikpsKQh8bixWq9dccAIBw+PymJa3wjIm+MTNLyVsXRKnLNs3Ftbo1DQCAS9c37mStn5mgLC2cicfjxVq7DRrUxy9bgs+Fme8W0AAAAABJRU5ErkJggg=="
                            />
                        </span>
                    </div>
                </div>
            </div>

            <Collapse
                in={isShowingComment}
                className="commentWrapper"
            >
                <Comments
                    className="comment"
                    postId={post._id}
                    postUserId={post.userId}
                    setcommentNum = {setcommentNum}
                    socket = {socket}
                >
                </Comments>
            </Collapse>
        </div>
    );
}
