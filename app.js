/**
 * Main application file.
 * 
 * NOTE: This file contains many required packages, but not all of them - you may need to add more!
 */

// Setup Express
const express = require("express");
const app = express();
const port = 3000;

// Setup Handlebars
const handlebars = require("express-handlebars");
app.engine("handlebars", handlebars.engine({
    defaultLayout: "main"
}));
app.set("view engine", "handlebars");

// Setup body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Setup cookie-parser
const cookieParser = require("cookie-parser");
app.use(cookieParser());

// Make the "public" folder available statically
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));

// Use the toaster middleware
const { toaster } = require("./middleware/toaster-middleware.js");
app.use(toaster);

// Setup our middleware
const { addUserToLocals } = require("./middleware/auth-middleware.js");
app.use(addUserToLocals);

// Setup our routes
const authRouter = require("./routes/auth-routes.js");
app.use(authRouter);

const appRouter = require("./routes/application-routes.js");
app.use(appRouter);

const publishBlogRouter = require("./routes/publish-blog-routes.js");
app.use(publishBlogRouter);

const publishCommentRouter = require("./routes/comment-routes.js");
app.use(publishCommentRouter);


// Start the server running.
app.listen(port, function () {
    console.log(`The Best App In The World ™️ listening on port ${port}!`);
});