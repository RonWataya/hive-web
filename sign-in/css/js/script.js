//Pop up modal
document.addEventListener('DOMContentLoaded', function() {
    const infoIcon = document.getElementById('infoIcon');
    const customPopup = document.getElementById('customPopup');
    const closeBtn = document.getElementById('closeBtn');

    // Function to toggle the popup visibility
    function togglePopup() {
        customPopup.style.display = customPopup.style.display === 'block' ? 'none' : 'block';
    }

    // Event listeners for the info icon and close button
    infoIcon.addEventListener('click', togglePopup);
    closeBtn.addEventListener('click', togglePopup);
});