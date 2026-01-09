const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const postsController = require("../controllers/posts");
const Favourite = require("../models/Favourite");
const { ensureAuth } = require("../middleware/auth");

// Existing routes

router.get("/favourites", ensureAuth, postsController.getFavourites);
router.get("/:id", ensureAuth, postsController.getPost);
router.post("/createPost", upload.single("file"), postsController.createPost);
router.post("/favouritePost/:id", ensureAuth, postsController.favouritePost);
router.put("/likePost/:id", postsController.likePost);
router.delete("/deletePost/:id", postsController.deletePost);

// --- NEW ROUTES for React like button API ---

// Get current likes count (returns JSON)
router.get("/:id/likes", async (req, res) => {
  try {
    const post = await postsController.getPostById(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ count: post.likes || 0 });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Increment likes (returns updated likes count in JSON)
router.post("/:id/like", async (req, res) => {
  try {
    const post = await postsController.incrementLikes(req.params.id);
    if (!post) return res.status(404).json({ error: "Post not found" });
    res.json({ count: post.likes });
  } catch (err) {
    res.status(500).json({ error: "Failed to like post" });
  }
});

module.exports = router;
