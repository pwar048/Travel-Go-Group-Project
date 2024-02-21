const { v4: uuid } = require("uuid");
const express = require("express");
const router = express.Router();

// The DAO that handles CRUD operations for users.
const userDao = require("../modules/users-dao.js");

router.get("/login", function (req, res) {

    if (res.locals.user) {
        res.redirect('dashboard');
    }
    else {
        res.render("login");
    }

});

// Whenever we POST to /login, check the username and password submitted by the user.
// If they match a user in the database, give that user an authToken, save the authToken
// in a cookie, and redirect to "/". Otherwise, redirect to "/login", with a "login failed" message.
router.post("/login", async function (req, res) {
    // Get the username and password submitted in the form
    const username = req.body.username;
    const password = req.body.password;

    // Find a matching user in the database
    const user = await userDao.retrieveUserWithCredentials(username, password);

    // if there is a matching user...
    if (user) {
        // Auth success - give that user an authToken, save the token in a cookie, and redirect to the homepage.
        const authToken = uuid();
        user.authToken = authToken;
        await userDao.updateUser(user);
        res.cookie("authToken", authToken);
        res.locals.user = user;
        // res.redirect("/");
        res.render('dashboard');
        res.redirect('/dashboard');
    }

    // Otherwise, if there's no matching user...
    else {
        // Auth fail
        res.locals.user = null;
        res.setToastMessage("Authentication failed!");
        res.redirect("./login");
    }
});

router.post('/register', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const name = req.body.name;
    const avatar_link = req.body.avatar;
    const date_of_birth = req.body.birthday;
    const description = req.body.description;
    const user = {
        username: username,
        password:password,
        name:name,
        dob: date_of_birth,
        avatar_link: `images/avatars/${avatar_link}`,
        description: description
    }
    await userDao.createUser(user);
    res.setToastMessage("thank you for registering with us， please click login");
    res.redirect("./register");
});


router.get("/logout", function (req, res) {
    res.clearCookie("authToken");
    res.locals.user = null;
    res.setToastMessage("Successfully logged out!");
    res.redirect("./login");
});


router.post('/check-username', async (req, res) => {
    const userInput = req.body.username;
    const count = await userDao.checkUsername(userInput);
    const exists = count[0].count > 0;
    res.json({ exists });

});



module.exports = router;