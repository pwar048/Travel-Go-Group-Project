window.addEventListener("load", function(){
    console.log('userProfile.js loaded');
    //get delete button
    const deleteAccountForm = document.getElementById('deleteAccountForm');
    const delBtn = document.querySelector('#delete-account-btn');
    deleteAccountForm.addEventListener('submit', function(event) {
        // Prevent the default form submission
        event.preventDefault();
    
        // Display a confirmation dialog
        const isConfirmed = confirm('Are you sure you want to delete your account? All your blogs and comments will be deleted. This action cannot be undone.');
    
        // Check the user's response
        if (isConfirmed) {
            // User clicked 'OK', proceed with form submission
            deleteAccountForm.submit();
        } else {
            // User clicked 'Cancel', do nothing
            console.log('Account deletion canceled');
        }
    });

})