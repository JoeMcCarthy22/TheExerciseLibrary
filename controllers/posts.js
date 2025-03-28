const cloudinary = require("../middleware/cloudinary");
const Post = require("../models/Post");
const Favourite = require("../models/favourite");

module.exports = {
  getProfile: async (req, res) => { 
    console.log(req.user)
    try {
      //Since we have a session each request (req) contains the logged-in users info: req.user
      //console.log(req.user) to see everything
      //Grabbing just the posts of the logged-in user
      const posts = await Post.find({ user: req.user.id });
      //Sending post data from mongodb and user data to ejs template
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },
  getPost: async (req, res) => {
    try {
      //id parameter comes from the post routes
      //router.get("/:id", ensureAuth, postsController.getPost);
      //http://localhost:2121/post/631a7f59a3e56acfc7da286f
      //id === 631a7f59a3e56acfc7da286f
      const post = await Post.findById(req.params.id);
      res.render("post.ejs", { post: post, user: req.user});
    } catch (err) {
      console.log(err);
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);

      //media is stored on cloudainary - the above request responds with url to media and the media id that you will need when deleting content 
      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        videoUrl: req.body.videoUrl || "", // Use empty string if no video URL is provided
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
      // Ensure user is authenticated
      if (!req.user) {
        return res.status(401).send("User not authenticated");
      }
  
      // Log the ID to check if it's valid
      console.log("Post ID to favourite:", req.params.id);
  
      // Check if the favourite already exists
      const existingFavourite = await Favourite.findOne({
        user: req.user.id,
        post: req.params.id,
      });
  
      if (existingFavourite) {
        console.log("⚠️ Post is already in favourites.");
      } else {
        // Create favourite if it doesn't exist
        await Favourite.create({
          user: req.user.id,
          post: req.params.id,
        });
        console.log("✅ Post has been favourited!");
      }
  
      // Redirect back to the post or the previous page
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
        {
          $inc: { likes: 1 },
        }
      );
      console.log("Likes +1");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId);
      // Delete post from db
      await Post.remove({ _id: req.params.id });
      console.log("Deleted Post");
      res.redirect("/profile");
    } catch (err) {
      res.redirect("/profile");
    }
  },
  getFavourites: async (req, res) => {
    console.log("User ID: ", req.user.id);  // Log the user ID here
    try {
      const favouritedPosts = await Favourite.find({ user: req.user.id }).populate("post");
      console.log("Favourited posts found:", favouritedPosts);
      res.render("favourites.ejs", { posts: favouritedPosts, user: req.user });
    } catch (err) {
      console.log("❌ Error fetching favourites:", err);
      res.status(500).send("Server Error");
    }
  }
  
  
  
  
  
}

