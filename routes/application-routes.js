const express = require("express");
const router = express.Router();
const { verifyAuthenticated, verifyOwnership } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/users-dao.js");
const fs = require('fs');
const path = require('path');


router.get("/", async function (req, res) {
    const data = await userDao.retrieveAllBlogsAndComments();
    res.render('home', { data });
});

router.get('/createBlog', verifyAuthenticated, function (req, res) {
    res.render('createBlog')
})

router.get("/register", function (req, res) {
    const avatarsDirectory = path.join(__dirname, '..', 'public', 'images', 'avatars');
    fs.readdir(avatarsDirectory, (err, files) => {
        if (err) {
            console.error('Error reading directory', err);
            res.status(500).send('Error reading directory');
            return;
        }

        // Filter only image files
        const imageFiles = files.filter(file => {
            const fileExtension = path.extname(file).toLowerCase();
            return fileExtension === '.jpg' || fileExtension === '.png' || fileExtension === '.jpeg';
        });
        res.render('register', { avatars: imageFiles });
    });
});

router.get("/login", verifyAuthenticated, function (req, res) {
    res.render("dashboard");
});

router.get('/dashboard', verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const articles = await userDao.retrieveAllBlogs(user);
    res.render("dashboard", { articles, user });
})

router.get('/updateProfile', verifyAuthenticated, function (req, res) {
    const user = res.locals.user;
    res.render("profile-edit", { user });
})

router.post('/deleteAccount', async (req, res) => {
    const user = res.locals.user;
    userDao.deleteUser(user.id);
    res.send('account deleted');
})


router.get('/getArticle/:articleId', async (req, res) => {
    const articleId = req.params.articleId;
    const blogData = await userDao.retrieveSingleBlog(articleId);
    res.json({ blogData });
});

router.get('/deleteArticle/:articleId', async (req, res) => {
    const articleId = req.params.articleId;
    await userDao.deleteSingleBlog(articleId);
    res.redirect('/dashboard');
});

router.get('/editBlog/:articleId', verifyOwnership, async function (req, res) {
    const articleId = req.params.articleId;
    const blogs = await userDao.retrieveSingleBlog(articleId);
    const blog = blogs[0];
    res.render("blog-edit",{ blog });
})

router.post('/updateProfile', verifyAuthenticated, async function (req, res) {
    const user = res.locals.user;
    const newName = req.body.name;
    const newDescription = req.body.description;
    const userInput = {
        name: newName,
        description: newDescription
    }
    await userDao.updateUserProfile(user, userInput);
    res.setToastMessage('user profile updated');
    res.redirect('/updateProfile');
})

router.post('/updateBlog/:blogId', async function (req, res) {
    const articleId = req.body.blog_id;
    const user = res.locals.user;
    const userInput = {
        title: req.body.title,
        article: req.body.article,
        location_of_interest: req.body.locationOfInterest,
        video_link: req.body.videoLink,
        img_link: req.body.imgLink,
    }
    await userDao.updateBlog(articleId, userInput);
    res.setToastMessage(`blog ID ${articleId} updated`);
    res.redirect(`/editBlog/${articleId}`);
})

module.exports = router;