const express = require("express");
const router = express.Router();
const userDaoBlog = require("../modules/user-dao-createBlog.js");
const fs = require('fs');
const upload = require("../middleware/multer-uploader.js");

router.post('/publishBlog', upload.single("blogImage"), async (req, res) => {
    const user = res.locals.user;
    const writer_id = user.id;
    const currentDate = new Date().toISOString().split('T')[0];
    const currentTime = new Date().toLocaleTimeString('en-US', { hour12: false });
    const blog = {
        title: req.body.blogTitle,
        article: req.body.blogContent,
        location_of_interest: req.body.blogLocation,
        video_link: req.body.blogVideo,
        img_link: "",
        blog_date: currentDate,
        blog_time: currentTime
    }

    //start: move and rename the uploaded image to images/blogs/${blog.id}/XXXX.jpg folder
    try {
        const newBlogObject = await userDaoBlog.createBlog(blog, writer_id);
        const fileInfo = req.file;
        const oldFilePath = fileInfo.path;
        const newFolderPath = `public/images/blogs/${newBlogObject.id}`;
        const newFileName = `${newFolderPath}/${fileInfo.originalname}`;


        // Check if the destination folder exists, if not, create it
        if (!fs.existsSync(newFolderPath)) {
            fs.mkdirSync(newFolderPath, { recursive: true });
        }
        fs.renameSync(oldFilePath, newFileName);
        //end: move and rename the uploaded image to images/blogs/${blog.id}/XXXX.jpg folder
        const img_link_url = `images/blogs/${newBlogObject.id}/${fileInfo.originalname}`
        userDaoBlog.addBlogImg(newBlogObject.id, img_link_url)

    } catch (error) {
        console.error('Error moving the file:', error);
    }
    res.setToastMessage("Blog published successfully");
    res.redirect("./createBlog");
})

module.exports = router;