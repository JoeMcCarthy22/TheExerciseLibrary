const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Favourite = require("../models/Favourite");

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user);
    try {
      const posts = await Post.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  createPost: async (req, res) => {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        videoUrl: req.body.videoUrl || "",
        likes: 0,
        user: req.user.id,
      });
      console.log("Post has been added!");
      res.redirect("/profile");
    } catch (err) {
      console.log(err);
    }
  },

  favouritePost: async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }
      console.log("Post ID to favourite:", req.params.id);
      const existingFavourite = await Favourite.findOne({
        user: req.user.id,
        post: req.params.id,
      });
      if (existingFavourite) {
        console.log("⚠️ Post is already in favourites.");
      } else {
        await Favourite.create({
          user: req.user.id,
          post: req.params.id,
        });
        console.log("✅ Post has been favourited!");
      }
      res.redirect(req.headers.referer || `/post/${req.params.id}`);
    } catch (err) {
      console.error("❌ Error in favouritePost:", err);
      res.status(500).send("Server error");
    }
  },

  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        { $inc: { likes: 1 } }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },

  deletePost: async (req, res) => {
    try {
      let post = await Post.findById({ _id: req.params.id });
      await cloudinary.uploader.destroy(post.cloudinaryId);
      await Post.deleteOne({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },

  getFavourites: async (req, res) => {
    try {
      const favourites = await Favourite.find({ user: req.user.id }).populate("post");
      res.render("favourites.ejs", { favourites });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  },

  // New helper: Get post by ID (for API)
  getPostById: async (id) => {
    try {
      return await Post.findById(id);
    } catch (err) {
      console.error(err);
      return null;
    }
  },

  // New helper: Increment likes and return updated post (for API)
  incrementLikes: async (id) => {
    try {
      return await Post.findByIdAndUpdate(
        id,
        { $inc: { likes: 1 } },
        { new: true }
      );
    } catch (err) {
      console.error(err);
      return null;
    }
  }
};
