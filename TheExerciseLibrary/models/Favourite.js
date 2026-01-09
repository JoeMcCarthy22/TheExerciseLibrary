const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post",
    required: true,
  },
});

// Ensure a user can only favourite a post once
FavouriteSchema.index({ user: 1, post: 1 }, { unique: true });

module.exports = mongoose.model("Favourite", FavouriteSchema);
