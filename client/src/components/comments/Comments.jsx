import * as React from "react"
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box'
import { TextField, Button, CircularProgress, Collapse } from "@mui/material";
import axios from "axios";
import { AuthContext } from "../../context/AuthContext";
import { TransitionGroup } from 'react-transition-group';
import { format } from "timeago.js";
import { Link } from "react-router-dom";
import DeleteIcon from '@material-ui/icons/Delete';
import { useContext, useEffect, useState, useRef } from "react";

export function Comments({ postId, setcommentNum }) {

    const commentContent = useRef()
    const [comments, setComments] = useState([])
    //const [isPosting, setIsPosting] = useState(false)
    const [isFetchingComments, setIsFetchingComments] = useState(true)

    const { user } = useContext(AuthContext)

    const PF = process.env.REACT_APP_PUBLIC_FOLDER;

    // fetch comments
    useEffect(() => {
        /**
         * Method: GET 
         * URL: /posts/:postId/comments
         * Desc: get all comment for given post
         * */
        const fetchComments = async (postId) => {
            setIsFetchingComments(true)
            try {
                const result = await axios.get(`/posts/${postId}/comments`)
                //console.log(result)
                setComments(result.data.sort((p1, p2) => {
                    return new Date(p2.timestamps) - new Date(p1.timestamps);
                  }));
                //console.log(comments)
            } catch (err) {
                console.log(err)
            }
            setIsFetchingComments(false)
        }
        // window.setTimeout(() => {
        //     fetchComments(postId)
        // }, 20)
        fetchComments(postId)
    }, [postId])

    // push comments
    /**
     * Method: POST
     * URL: /posts/:postId/comments
     * Params: {
     data: {
        userId: String
        content: String
        timestamp: Date // might not needed
     }}
     * Desc: current user post a comment under the given Post
     * */
    const postComment = async () => {
        //setIsPosting(true)
        if (!user) {
            window.alert("You are not login!")
        } else {
            try {
                const res = await axios.post(`/posts/${postId}/comments`, {
                    userId: user._id ?? null,
                    desc: commentContent.current.value
                })
                //console.log(res.data);
                commentContent.current.value = null;

                setComments(prevComments => {
                    return [res.data, ...prevComments]
                });
                
                setcommentNum(prevCommentsNum => prevCommentsNum + 1);
                console.log(comments)
            } catch (err) {
                console.error("Fail to post!")
            }
        }
        //setIsPosting(false)
    }


    // useEffect(() => {
    //     setIsLiked(post.likes.includes(currentUser._id));
    // }, [comments]);


    const deleteHandler = async (commentId, userId) => {
        try {
            // console.log(commentId)
            // console.log(userId)
            await axios.delete("/posts/" + commentId, { data: { userId, postId } });
            setComments(prevComments => {
                return prevComments.filter(comment => comment.commentId !== commentId);
            });
            setcommentNum(prevCommentsNum => prevCommentsNum - 1);
        } catch (err) { console.error(err) }
    }

    return (
        <>
            <Box
                component="form"
                sx={{
                    display: 'flex',
                    flex: 'row nowrap',
                    padding: '8px 16px',
                    gap: '5px'
                }}
            >
                <TextField
                    fullWidth
                    inputRef={commentContent}
                    multiline
                    variant="standard"
                ></TextField>
                <Button onClick={postComment}>Comment</Button>
            </Box>
            {isFetchingComments &&
                <Box
                    sx={{
                        display: 'flex',
                        flex: 'row nowarp',
                        justifyContent: 'center'
                    }}
                >
                    <CircularProgress  size = '1rem'/>
                </Box>
            }
            <List
                sx={{
                    width: '100%',
                    bgcolor: 'background.paper'
                }}
            >
            <TransitionGroup >
                {comments.map((comment) => (
                    <Collapse key={comment.commentId}>
                        <Divider variant="middle" component="li" />
                        
                        <div className="commentTop">
                            <div className="commentTopLeft">
                                <Link to={`/profile/${comment.username}`}>
                                    <img
                                        className="commentProfileImg"
                                        src={
                                            comment.avatar
                                                ? PF + comment.avatar
                                                : PF + "person/noAvatar.png"
                                        }
                                        alt=""
                                    />
                                </Link>
                                <span className="postUsername">{comment.username}</span>
                                <span className="postDate">{format(comment.timestamps)}</span>
                            </div>
                            <div>
                                {comment.username === user.username &&
                                    <Button size="small" color="primary" onClick={(e) =>deleteHandler(comment.commentId, comment.userId)}>
                                        <DeleteIcon fontSize="small" />
                                    </Button>}
                            </div>
                        </div>
                        <div className="commentCenter">
                            <span className="postText">{comment?.content}</span>
                        </div>
                    </Collapse>
                ))}
            </TransitionGroup>
            </List>
        </>
    )
}