const SQL = require("sql-template-strings");
const dbPromise = require("./database.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

/**
 * Inserts the given user into the database. Then, reads the ID which the database auto-assigned, and adds it
 * to the user.
 * 
 * @param user the user to insert
 */
async function createUser(user) {
    const db = await dbPromise;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    try {
        const result = await db.run(SQL`
        insert into users (username, password, name, dob, description, avatar_link) 
        values(${user.username}, ${hashedPassword}, ${user.name}, ${user.dob}, ${user.description}, ${user.avatar_link})`);

        // Get the auto-generated ID value, and assign it back to the user object.
        user.id = result.lastID;
    } catch (error) {
        console.error(error);
    }
}

/**
 * Gets the user with the given id from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {number} id the id of the user to get.
 */
async function retrieveUserById(id) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where id = ${id}`);

    return user;
}

/**
 * Gets the user with the given username and password from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} username the user's username
 * @param {string} password the user's password
 */

async function retrieveUserWithCredentials(username, password) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where username = ${username}`);
    if (user) {
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            return user
        }
    }

    return null;
}

/**
 * Gets the user with the given authToken from the database.
 * If there is no such user, undefined will be returned.
 * 
 * @param {string} authToken the user's authentication token
 */
async function retrieveUserWithAuthToken(authToken) {
    const db = await dbPromise;

    const user = await db.get(SQL`
        select * from users
        where authToken = ${authToken}`);

    return user;
}

/**
 * Gets an array of all users from the database.
 */
async function retrieveAllUsers() {
    const db = await dbPromise;

    const users = await db.all(SQL`select * from users`);

    return users;
}

/**
 * Updates the given user in the database, not including auth token
 * 
 * @param user the user to update
 */
async function updateUser(user) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set username = ${user.username}, password = ${user.password},
            name = ${user.name}, authToken = ${user.authToken}
        where id = ${user.id}`);
}

async function updateUserProfile(user, userInput) {
    const db = await dbPromise;
    await db.run(SQL`
        update users
        set name = ${userInput.name}, description = ${userInput.description}
        where id = ${user.id}`);
}

async function updateBlog(blog_id, userInput) {
    const db = await dbPromise;
    await db.run(SQL`
    update blog
    set title = ${userInput.title},
    article = ${userInput.article},
    location_of_interest = ${userInput.location_of_interest},
    video_link = ${userInput.video_link},
    img_link = ${userInput.img_link}
    where id = ${blog_id}
    `);
}


/**
 * Deletes the user with the given id from the database.
 * 
 * @param {number} id the user's id
 */
async function deleteUser(id) {
    const db = await dbPromise;
    console.log(`user id is ${id}`)

    // Delete comments linked to blogs written by the user
    
    // Delete blogs authored by the user along with comments belongs to the blogs
    await db.run(SQL`delete from comments where reviewer_id = ${id};`);
    await db.run(SQL`DELETE FROM comments
    WHERE blog_id IN (SELECT id FROM blog WHERE writer_id = ${id});`)
    
await db.run(SQL`delete from blog where writer_id = ${id};`)
    // Delete the user
    await db.run(SQL`DELETE FROM users WHERE id = ${id}`);
    console.log(`code 147`)

}

//get all blogs
async function retrieveAllBlogs(user) {
    const db = await dbPromise;
    const blogs = await db.all(SQL`select * from blog where writer_id=${user.id}`);
    return blogs;
}

async function retrieveSingleBlog(blog_id) {
    const db = await dbPromise;
    const blogs = await db.all(SQL`select * from blog where id=${blog_id}`);
    return blogs;
}

async function deleteSingleBlog(blog_id) {
    const db = await dbPromise;
    // Delete all comments belongs to this article
    await db.run(SQL`DELETE FROM comments WHERE blog_id = ${blog_id}`);
    //delete the blog
    await db.run(SQL`DELETE FROM blog
    WHERE id = ${blog_id}`);
}


async function run() {
    // const blogs = await retrieveAllBlogs_and_users();
    // const comments = await retrieveComments(1);
    const data = await retrieveAllBlogsAndComments()
    console.log(data[0])
}

// run()

//retrieve all blogs and accosiated authors
async function retrieveAllBlogs_and_users() {
    const db = await dbPromise;
    const blogs_and_authors = await db.all(SQL`
    SELECT b.id, title, blog_date, blog_time, article,  img_link, video_link, writer_id,username, description,  avatar_link from blog as b, users as u
    WHERE b.writer_id=u.id ORDER by blog_date DESC, blog_time DESC `);
    return blogs_and_authors;
}

async function retrieveComments(blog_id) {
    const db = await dbPromise;
    const comments = await db.all(SQL`
    SELECT b.id, c.date,text, username, avatar_link from blog as b, comments as c, users as u WHERE b.id=c.blog_id AND c.reviewer_id = u.id AND b.id=${blog_id}
    `);
    return comments;
}

async function retrieveAllBlogsAndComments() {
    const blogsAndAuthors = await retrieveAllBlogs_and_users();
    const blogsAndComments = [];

    for (const blog of blogsAndAuthors) {
        const comments = await retrieveComments(blog.id);
        blogsAndComments.push({ ...blog, comments });
    }

    return blogsAndComments;
}

// Query the database to check if the username exists
// Example assumes the use of a SQL database, adjust it as per your database setup
async function checkUsername(username) {
    const db = await dbPromise;
    const count = await db.all(SQL`
    SELECT COUNT(*) AS count FROM users WHERE username = ${username}
    `)
    return count;
}

async function getAllBlogIDsBy(userID) {
    const db = await dbPromise;
    const result_blog_ids = await db.all(SQL`
    SELECT id from blog 
WHERE writer_id = ${userID}
`)
    return result_blog_ids
}

async function addComment(userID, comment_text, blog_id){
    const db = await dbPromise;
    const currentDateTime = new Date().toISOString().replace('T', ' ').replace(/\.\d{3}Z/, '');
    console.log(currentDateTime);
    await db.run(SQL`
    INSERT INTO comments(date, text, reviewer_id, blog_id)
VALUES
    (${currentDateTime}, ${comment_text}, ${userID}, ${blog_id})
    `)
}


// Export functions.
module.exports = {
    createUser,
    retrieveUserById,
    retrieveUserWithCredentials,
    retrieveUserWithAuthToken,
    retrieveAllUsers,
    updateUser,
    deleteUser,
    retrieveAllBlogs,
    retrieveAllBlogs_and_users,
    retrieveComments,
    retrieveAllBlogsAndComments,
    checkUsername,
    updateUserProfile,
    retrieveSingleBlog,
    deleteSingleBlog,
    updateBlog,
    getAllBlogIDsBy,
    addComment
};