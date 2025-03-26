const Post = require("../models/Post");

module.exports = {
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
      res.render("feed", { posts, user: req.user });
    } catch (err) {
      console.error(err);
      res.redirect("/profile");
    }
  },
};
