const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const Favourite = require("../models/Favourite"); 
const { ensureAuth } = require("../middleware/auth");

//Post Routes

//test route for debugging
router.get("/test-favourites", ensureAuth, async (req, res) => {
    try {
      const favourites = await Favourite.find({ user: req.user.id }).populate("post");
      res.json(favourites);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  
//Since linked from server js treat each path as:
//post/:id, post/createPost, post/likePost/:id, post/deletePost/:id


//Enables user to display favourite'd posts
router.get('/favourites', ensureAuth, postsController.getFavourites);

router.get("/:id", ensureAuth, postsController.getPost);

//Enables user to create post w/ cloudinary for media uploads
router.post("/createPost", upload.single("file"), postsController.createPost);

//Enables user to add post to favourites
router.post("/favouritePost/:id", ensureAuth, postsController.favouritePost);

//Enables user to like post. In controller, uses POST model to update likes by 1
router.put("/likePost/:id", postsController.likePost);

//Enables user to delete post. In controller, uses POST model to delete post from MongoDB collection
router.delete("/deletePost/:id", postsController.deletePost);



module.exports = router;
