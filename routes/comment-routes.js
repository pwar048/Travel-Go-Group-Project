const express = require("express");
const router = express.Router();
const { verifyAuthenticated, verifyOwnership } = require("../middleware/auth-middleware.js");
const userDao = require("../modules/users-dao.js");

router.post('/submitComment', verifyAuthenticated, async (req, res)=>{
    const user = res.locals.user;
    const comment_text = req.body.text
    const blog_id = req.query.blog_id;
    console.log(user.id, comment_text, blog_id)
    await userDao.addComment(`${user.id}`, comment_text, blog_id);
    res.redirect('/')
})

module.exports = router;