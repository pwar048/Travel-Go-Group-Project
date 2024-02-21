const userDao = require("../modules/users-dao.js");


async function addUserToLocals(req, res, next) {
    const user = await userDao.retrieveUserWithAuthToken(req.cookies.authToken);
    res.locals.user = user;
    next();
}

function verifyAuthenticated(req, res, next) {
    console.log(`res.locals.user is:${res.locals.user}`);
    if (res.locals.user) {
        next();
    }
    else {
        res.redirect("/login");
    }
}

 async function verifyOwnership (req, res, next) {
    const articleId = req.params.articleId;
    const user = res.locals.user;
    const userId = user.id 
    const userOwnsBlog = await userDao.getAllBlogIDsBy(userId);

    let isArticleOwned = false;
    for (let i = 0; i < userOwnsBlog.length; i++) {
        if (userOwnsBlog[i].id === parseInt(articleId)) {
            isArticleOwned = true;
            break;
        }
    }
    // Check if the user owns the blog
    if (isArticleOwned) {
        next(); // User is authorized, process to the blog page
    } else {
        res.status(403).send("Unauthorized"); 
    }
};

module.exports = {
    addUserToLocals,
    verifyAuthenticated,
    verifyOwnership
}