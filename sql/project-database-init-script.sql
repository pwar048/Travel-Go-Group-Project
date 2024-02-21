DROP TABLE IF EXISTS comments;
DROP table if EXISTS blog;
DROP TABLE IF EXISTS users;
drop table if exists test;


CREATE TABLE if NOT EXISTS users (
    id INTEGER not NULL PRIMARY KEY, --AUTO INCREMENT
	username varchar(20) not null UNIQUE,
    password VARCHAR(40) NOT NULL, 
    name varchar(40),
    dob DATE,
    description TEXT,
    avatar_link VARCHAR(255),
	authToken varchar(128)
);

INSERT INTO users (username, password, name, dob, description, avatar_link)
VALUES 
    ('test', '$2b$10$xlF8laUWT.BV/BeuPA99kOZyNwK2GaRddvSLJCs6ZqDLXt9hrMSKW', 'John Doe', '1990-05-15', 'I am an enthusiastic person.', 'images/avatars/avatar_3.png'),
    ('coolgirl22', '$2b$10$xlF8laUWT.BV/BeuPA99kOZyNwK2GaRddvSLJCs6ZqDLXt9hrMSKW', 'Emily Smith', '1988-11-30', 'Avid reader and nature lover.', 'images/avatars/avatar_6.png'),
    ('traveler99', '$2b$10$xlF8laUWT.BV/BeuPA99kOZyNwK2GaRddvSLJCs6ZqDLXt9hrMSKW', 'David Brown', '1985-08-20', 'Passionate about exploring new places.',  'images/avatars/avatar_4.png'),
	('del', '$2b$10$xlF8laUWT.BV/BeuPA99kOZyNwK2GaRddvSLJCs6ZqDLXt9hrMSKW', 'delete account', '1985-08-20', 'Passionate about exploring new places.',  'images/avatars/avatar_1.png');

CREATE TABLE if not EXISTS blog (
    id INTEGER not NULL PRIMARY KEY, --AUTO INCREMENT
    title VARCHAR(255) NOT NULL,
    blog_date DATE,
	blog_time TIME,
    article TEXT,
    location_of_interest VARCHAR(255),
    video_link VARCHAR(255),
    img_link VARCHAR(255),
    writer_id INT, 
    FOREIGN KEY (writer_id) REFERENCES users(id)
);

CREATE TABLE if NOT EXISTS comments (
    id INTEGER not NULL PRIMARY KEY, --AUTO INCREMENT
    date DATETIME,
    text TEXT,
    reviewer_id INT,
	blog_id int,
    FOREIGN KEY (reviewer_id) REFERENCES users(id),
	FOREIGN KEY (blog_id) REFERENCES blog(id)
);

INSERT INTO blog (title, blog_date, blog_time, article, location_of_interest, video_link, img_link, writer_id)
VALUES 
    ('Exploring Auckland', '2023-10-10', '08:45:00', 'Discover the charm of Auckland and its stunning landmarks.', 'Auckland', 'https://www.youtube.com/watch?v=qnstz3M_gTo', 'images/blogs/1/auckland.png', 1),
    ('Adventure in Wellington', '2023-10-05', '12:30:00', 'Experience thrilling adventures in Wellington.', 'Wellington', 'https://www.youtube.com/watch?v=I6eVSWMqS98', 'images/blogs/2/wellington.png', 2),
    ('Nature Retreat in Queenstown', '2023-10-20', '10:00:00', 'Explore the natural beauty of Queenstown and its surroundings.', 'Queenstown', 'https://www.youtube.com/watch?v=zNduKgN15G0', 'images/blogs/3/queenstown.png', 1);

INSERT INTO comments (date, text, reviewer_id, blog_id)
VALUES 
    ('2023-10-29 08:15:00', 'Great article, enjoyed reading it!', 1, 1),
    ('2023-10-30 12:30:00', 'Interesting insights on this topic!', 2, 1),
    ('2023-11-02 10:45:00', 'I appreciate the depth of your analysis.', 3, 1),
    ('2023-11-05 15:20:00', 'Looking forward to more content like this.', 1, 2),
	('2023-11-05 15:20:00', 'test --- delete comments.', 4, 1);

SELECT b.id, c.date,text, username, avatar_link  from blog as b, comments as c, users as u WHERE b.id=c.blog_id AND c.reviewer_id = u.id AND b.id=1;
SELECT * from users;

SELECT * from blog as b, comments as c 
WHERE b.id=c.blog_id AND b.writer_id=1;



