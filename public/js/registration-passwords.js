window.addEventListener('load', function(){
    document.getElementById("registrationForm").addEventListener("submit", function(event) {
        const password = document.getElementById("txtPassword").value;
        const confirmPassword = document.getElementById("repassword").value;
        const passwordMismatchError = document.getElementById("passwordMismatch");
    
        if (password !== confirmPassword) {
            passwordMismatchError.style.display = "block";
            event.preventDefault(); // form will not process when 'create account' button clicked
        } else {
            passwordMismatchError.style.display = "none";
        }
    });

})
