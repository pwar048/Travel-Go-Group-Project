document.addEventListener("DOMContentLoaded", function () {
    let selectedAvatar = null;
    document.querySelectorAll('.avatar').forEach(function (avatar) {
        avatar.addEventListener('click', function (event) {
            if (selectedAvatar) {
                selectedAvatar.classList.remove('avatar-selected');
            }
            event.currentTarget.classList.add('avatar-selected');
            selectedAvatar = event.currentTarget;
        });
    });
});