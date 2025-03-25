const mongoose = require("mongoose");

const FavouriteSchema = new mongoose.Schema({
  title: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "title",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

//MongoDB Collection named here - will give lowercase plural of name 
module.exports = mongoose.model("Favourite", FavouriteSchema);
