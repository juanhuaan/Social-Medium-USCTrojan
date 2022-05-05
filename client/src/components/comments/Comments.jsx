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


export function Comments({ postId }) {

    const commentContent = React.useRef()
    const [comments, setComments] = React.useState([])
    const [isPosting, setIsPosting] = React.useState(false)
    const [isFetchingComments, setIsFetchingComments] = React.useState(true)

    const { user } = React.useContext(AuthContext)

    // fetch comments
    React.useEffect(() => {
        /**
         * Method: GET 
         * URL: /posts/:postId/comments
         * Desc: get all comment for given post
         * */
        const fetchComments = async (postId) => {
            setIsFetchingComments(true)
            try {
                const result = await axios.get(`/posts/${postId}/comments`)
                setComments(result.data)
            } catch (err) {
                setComments([
                    { id: 0, avatar: "", content: "1", username: "user1" },
                    { id: 1, avatar: "", content: "2", username: "user2" },
                    { id: 2, avatar: "", content: "3", username: "user3" }
                ])
            }
            setIsFetchingComments(false)
        }
        window.setTimeout(() => {
            fetchComments(postId)
        }, 5000)
        // fetchComments(postId)
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
        setIsPosting(true)
        if (!user) {
            window.alert("You are not login!")
        } else {
            try {
                axios.post(`/post/${postId}/comments`, {
                    userId: user._id ?? null,
                    content: commentContent.current
                })
            } catch (err) {
                console.error("Fail to post!")
            }
        }
        setIsPosting(false)
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
                    <CircularProgress />
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
                        <Collapse key={comment.id}>
                            <Divider variant="middle" component="li" />
                            <ListItem>
                                <ListItemAvatar>
                                    <Avatar src={comment.avatar}>
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText primary={comment.content} secondary={comment.username} />
                            </ListItem>
                        </Collapse>
                    ))}
                </TransitionGroup>

            </List>
        </>
    )
}