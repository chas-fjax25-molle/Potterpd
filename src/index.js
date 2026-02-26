function updateOnlineStatus() {
    const message = document.getElementById("offline-message");

    if (!message) return;

    if (!navigator.onLine) {
        message.style.display = "block";
    } else {
        message.style.display = "none";
    }
}

// Check on page load
updateOnlineStatus();

// Listen for connection changes
window.addEventListener("online", updateOnlineStatus);
window.addEventListener("offline", updateOnlineStatus);
