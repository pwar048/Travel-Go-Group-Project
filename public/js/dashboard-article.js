document.addEventListener("DOMContentLoaded", () => {
    //get all show buttons
    const displayBtns = document.querySelectorAll('.display-article');

    //get all delete buttons
    const deleteBtns = document.querySelectorAll('.delete-article');

    displayBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            const articleId_url = event.target.previousElementSibling['href'];
            const match = articleId_url.match(/\/getArticle\/(\d+)$/);
            const articleId = match[1];
            try {
                const response = await fetch(`/getArticle/${articleId}`);
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const articleData = await response.json();
                console.log(articleData);
                //get the div article container
                const div_id = `article-container blog_${articleId}`;
                const divContainer = document.getElementById(div_id);
                divContainer.innerHTML = `<p>blog ID: ${articleData.blogData[0].id}</p><p>text: ${articleData.blogData[0].article}</p>
          <p>create date: ${articleData.blogData[0].blog_date}</p>
          <p>create time: ${articleData.blogData[0].blog_time}</p>`;
            } catch (error) {
                console.error('Error fetching article:', error);
            }
        });
    });

    //get delete message P
    const deleteMessageP = document.querySelector('#deleteMessage');
    console.log(deleteMessageP);
    deleteBtns.forEach(button => {
        button.addEventListener('click', async (event) => {
            deleteMessageP.innerHTML = "<p style='color: red;'>processing delete, the page will reload once done ";
            const articleId_url = event.target.previousElementSibling.previousElementSibling.previousElementSibling['href'];
            const match = articleId_url.match(/\/getArticle\/(\d+)$/);
            const articleId = match[1];
            await fetch(`/deleteArticle/${articleId}`);
            setTimeout(() => {
                window.location.reload(); // Navigate to the dashboard page
            }, 3000);
        })
    })

});