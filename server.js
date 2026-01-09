const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");

// Routes & DB
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");

// Load environment variables from config/.env
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

// Connect to MongoDB
connectDB();

// Set view engine
app.set("view engine", "ejs");

// Static folder
app.use(express.static("public"));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Logging
app.use(logger("dev"));

// Override for PUT/DELETE
app.use(methodOverride("_method"));

// Sessions stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: require("mongoose").connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Flash messages
app.use(flash());

// Routes
app.use("/", mainRoutes);
app.use("/post", postRoutes);

// Set port from environment or fallback to 9000
const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});




/* const express = require("express");
const app = express();
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");
const flash = require("express-flash");
const logger = require("morgan");
const connectDB = require("./config/database");
const mainRoutes = require("./routes/main");
const postRoutes = require("./routes/posts");

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

/*
//Server Running
app.listen(process.env.PORT, () => {
  console.log("Server is running, you better catch it!");
}); 

const PORT = process.env.PORT || 9000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); */

