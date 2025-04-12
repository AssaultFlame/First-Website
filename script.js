// Set custom host and port values here
const customHost = "Coolboy_m4.aternos.me"; // Change this to whatever you want
const customPort = "15524";        // Change this to whatever you want

// Display the values
document.getElementById("host").innerText = customHost; // Or use window.location.hostname for the real Replit host
document.getElementById("port").innerText = customPort;

// Copy text function without popup
function copyText(elementId) {
    const text = document.getElementById(elementId).innerText;
    navigator.clipboard.writeText(text)
        .catch(err => {
            console.error("Failed to copy: ", err);
        });
}