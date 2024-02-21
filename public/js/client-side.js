window.addEventListener("load", function (event) {
    console.log('javascript client side linked');

    let isUsernameAvailable = true; // Flag to track the username availability

    // Make an AJAX call to the server
    if (this.document.querySelector('#txtUsername')) {
        document.querySelector('#txtUsername').addEventListener('input', function () {
            const username = this.value;
            checkUsernameAvailability(username);
        });
    }
    async function checkUsernameAvailability(username) {
        try {
            const response = await fetch('/check-username', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: username }),
            });

            const data = await response.json();
            const usernameMessage = document.getElementById('usernameMessage');

            if (data.exists) {
                usernameMessage.textContent = 'Username is already taken';
                isUsernameAvailable = false; // Set the flag to false if username is taken
            } else {
                usernameMessage.textContent = ''; // Clear the warning if the username is available
                isUsernameAvailable = true; // Set the flag to true if username is available
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    // Intercept the form submission
    if (this.document.getElementById('submitButton')) {
        document.getElementById('submitButton').addEventListener('click', function (event) {
            if (!isUsernameAvailable) {
                event.preventDefault(); // Prevent form submission if username is not available
                // Optionally, you can show an additional message to the user to correct the username.
                // For example: document.getElementById('generalErrorMessage').textContent = 'Please choose a different username.';
            }
        });
    }else{
        console.log('we are not on registeration page, client-side.js line 48')
    }
});
