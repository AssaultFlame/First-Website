// Import Firebase modular SDK functions
import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js';
import { getAuth, GoogleAuthProvider, signInWithRedirect, getRedirectResult, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js';
import { getFirestore, collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/11.8.1/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCeXL8vW8KTxzWVrCNBKTMASgHEOcph1Wg",
    authDomain: "coolboywebsite.firebaseapp.com",
    databaseURL: "https://coolboywebsite-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "coolboywebsite",
    storageBucket: "coolboywebsite.firebasestorage.app",
    messagingSenderId: "127458647504",
    appId: "1:127458647504:web:e93fed8b7baa3768c6add5",
    measurementId: "G-SMC9J03R5P"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// DOM Elements
const loginButton = document.getElementById('google-login');
const logoutButton = document.getElementById('logout');
const userInfo = document.getElementById('user-info');

// Handle Redirect Result
getRedirectResult(auth).then(result => {
    if (result) {
        console.log('User signed in via redirect:', result.user);
    }
}).catch(error => {
    alert(`Redirect Login Error: ${error.code} - ${error.message}`);
    console.error('Redirect Login Error:', error);
});

// Authentication State Listener
onAuthStateChanged(auth, user => {
    if (user) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        userInfo.textContent = `Welcome, ${user.displayName || 'User'}!`;
        enableWatchedButtons(user);
    } else {
        loginButton.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        userInfo.textContent = '';
        disableWatchedButtons();
    }
});

// Google Login with Redirect
loginButton.addEventListener('click', async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithRedirect(auth, provider);
    } catch (error) {
        alert(`Login Error: ${error.code} - ${error.message}`);
        console.error('Login Error:', error);
    }
});

// Logout
logoutButton.addEventListener('click', async () => {
    try {
        await signOut(auth);
        console.log('User signed out');
    } catch (error) {
        alert(`Logout Error: ${error.message}`);
        console.error('Logout Error:', error);
    }
});

// Enable/Disable Watched Buttons
function enableWatchedButtons(user) {
    document.querySelectorAll('.contact-button').forEach(button => {
        button.disabled = false;
        button.title = '';
        button.removeEventListener('click', handleWatchedClick);
        button.addEventListener('click', () => handleWatchedClick(button, user));
    });
}

function disableWatchedButtons() {
    document.querySelectorAll('.contact-button').forEach(button => {
        button.disabled = true;
        button.title = 'Please sign in to mark as watched';
        button.removeEventListener('click', handleWatchedClick);
    });
}

// Handle Watched Button Click
async function handleWatchedClick(button, user) {
    const animeTitle = button.getAttribute('data-anime');
    if (user) {
        await saveWatchedAnime(user.uid, animeTitle);
    } else {
        alert('Please sign in to mark this anime as watched.');
    }
}

// Save Watched Anime to Firestore
async function saveWatchedAnime(userId, animeTitle) {
    try {
        await addDoc(collection(db, 'watchedAnime'), {
            userId: userId,
            animeTitle: animeTitle,
            timestamp: serverTimestamp()
        });
        alert(`Thanks for marking "${animeTitle}" as watched!`);
    } catch (error) {
        alert(`Error saving watched anime: ${error.message}`);
        console.error('Firestore Error:', error);
    }
}