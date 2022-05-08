const router = require("express").Router();
const Post = require("../models/Post");
const User = require("../models/User");

//create a post
router.post("/", async (req, res) => {
  const newPost = new Post(req.body);
  try {
    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  } catch (err) {
    res.status(500).json(err);
  }
});

//update a post
router.put("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId === req.body.userId) {
      await post.updateOne({ $set: req.body });
      res.status(200).json("the post has been updated");
    } else {
      res.status(403).json("you can update only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//delete a post
router.delete("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId.includes(req.body.userId)) {
      if(post.isComment === true) {
        const parentPost = await Post.findById(req.body.postId);
        await parentPost.updateOne({ $pull: { comments: req.params.id } });
      }
      await post.deleteOne();

      res.status(200).json("the post has been deleted");
    } else {

      res.status(403).json("you can delete only your post");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//like / dislike a post
router.put("/:id/like", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      console.log("userId" + req.body.userId);
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

//get a post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get timeline posts
router.get("/timeline/:userId", async (req, res) => {
  try {
    const currentUser = await User.findById(req.params.userId);
    // check if the post is comment
    const userPosts = await Post.find( { $and: [{ userId: currentUser._id }, {isComment: false}]});
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ $and:[{userId: friendId},{isComment: false}]});
      })
    );
    res.status(200).json(userPosts.concat(...friendPosts));
  } catch (err) {
    res.status(500).json(err);
  }
});



//get all users post 
router.get ("/homepage/:userId", async (req, res) => {
  try {
    
    let allPosts = await Post.find({isComment: false});
    const curUser = await User.findById(req.params.userId);
   
    allPosts.sort((a, b) => {
      if (curUser.followers.includes(a.userId) || a.userId === curUser._id && (!curUser.followers.includes(b.userId) || b.userId !== curUser._id)) {
        return 1;
      } else if (curUser.followers.includes(b.userId) || b.userId === curUser._id && (!curUser.followers.includes(a.userId) || a.userId !== curUser._id)) {
        return -1;
      } 
      return 0;
    });
    res.status(200).json(allPosts);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get user's all posts
router.get("/profile/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const posts = await Post.find({ $and: [{ userId: user._id }, {isComment: false}]});
    res.status(200).json(posts);
  } catch (err) {
    res.status(500).json(err);
  }
});

/**
 * Method: POST
 * Description: Post a Comment
 * URL: /api/posts/:postId/comments
 * req.body = {
    "userId" : "6271819fc8bf11702e17bdbb",
    "desc" : string
   }
 * res = {
    "id": post.id,
    "avatar": user.profilePicture,
    "content": newComment.desc,
    "username": user.username,
    "timestamps": newComment.createdAt
  }
 */

router.post('/:postId/comments', async (req, res) => {
  try {
    // the body input of the comment must be desc
    const newComment = new Post(req.body);
    newComment.isComment = true;
    const savedComment = await newComment.save();
    const commentId = savedComment._id;
   
    const post = await Post.findById(req.params.postId);
    await post.updateOne({ $push: { comments: commentId } });

    const user = await User.findById(newComment.userId);
   
    res.status(200).json({
      commentId: commentId,
      avatar: user.profilePicture,
      content: newComment.desc,
      username: user.username,
      timestamps: newComment.createdAt,
      userId: user._id
  })
  } catch (err) {
    res.status(500).json(err);
  }
});


/**
 * Method: GET
 * Description: Get All comments of a given post
 * URL: /api/posts/:postId/comments
 * res = {
    "id": post.id,
    "avatar": user.profilePicture,
    "content": comment.desc,
    "username": user.username,
    "timestamps": comment.createdAt
  }
 */

router.get('/:postId/comments', async (req, res) => {
  try{
    const post = await Post.findById(req.params.postId);
    let out = []
    for (let id of post.comments) {
      let commentPost = await Post.findById(id);
      //console.log(commentPost)
      let commentUser = await User.findById(commentPost.userId);
      let result = {
        commentId: id,
        avatar: commentUser.profilePicture,
        content: commentPost.desc,
        username: commentUser.username,
        timestamps: commentPost.createdAt,
        userId: commentUser._id
      }
      out.push(result);
    }
     // console.log(out)
    // res.write(JSON.stringify(out));
    // res.end();
    res.status(200).json(out);
  } catch(err) {
    res.status(500).json(err);
  }
});


module.exports = router;


// // update a post
// router.put('/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { userId, desc, img, likes, comments, tags } = req.body;
//     if (!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send(`No post with id: ${id}`);
//     const updatedPost = { userId, desc, img, likes, comments, tags };
//     await Post.findByIdAndUpdate(id, updatedPost, { new: true });
//     res.status(200).json(updatedPost);
//   } catch (err) {
//     res.status(500).json(err);
//   }
// });