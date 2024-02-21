const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");

async function createBlog(blog, writer_id) {
    const db = await dbPromise;
    try {
        const result = await db.run(SQL`
        INSERT INTO blog (title, article, location_of_interest, video_link, img_link, writer_id, blog_date, blog_time)
VALUES 
    (${blog.title},${blog.article}, ${blog.location_of_interest}, ${blog.video_link}, ${blog.img_link}, ${writer_id}, ${blog.blog_date}, ${blog.blog_time}
        )`);
        // Get the auto-generated ID value, and assign it back to the blog object.
        blog.id = result.lastID;
        return blog
    } catch (error) {
        console.error(error);
    }
}

async function addBlogImg(blogID, img_link) {
    const db = await dbPromise;
    // add img_link to database
    await db.run(SQL`
    UPDATE blog
SET img_link = ${img_link}
WHERE id=${blogID};
    
    `)
}

// Export functions.
module.exports = {
    createBlog,
    addBlogImg
};
