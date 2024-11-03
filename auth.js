// קונפיגורציה
const AUTH_CONFIG = {
    CLIENT_ID: 'YOUR_GOOGLE_CLIENT_ID', // החלף עם ה-Client ID שלך
    SCOPES: 'profile email'
};

// אתחול Google Auth
function initGoogleAuth() {
    if (typeof gapi !== 'undefined') {
        gapi.load('auth2', () => {
            gapi.auth2.init({
                client_id: AUTH_CONFIG.CLIENT_ID
            }).then(() => {
                // בדוק אם המשתמש כבר מחובר
                checkLoginStatus();
            }).catch(error => {
                console.error('Google Auth initialization error:', error);
            });
        });
    }
}

// בדיקת סטטוס התחברות
function checkLoginStatus() {
    const auth2 = gapi.auth2?.getAuthInstance();
    if (auth2?.isSignedIn.get()) {
        updateUIAfterLogin(auth2.currentUser.get());
    }
}

// טיפול בהתחברות
function handleGoogleLogin() {
    if (typeof gapi === 'undefined') {
        console.error('Google API not loaded');
        return;
    }

    const auth2 = gapi.auth2.getAuthInstance();
    if (auth2) {
        auth2.signIn().then(
            user => updateUIAfterLogin(user),
            error => console.error('Login error:', error)
        );
    }
}

// טיפול בהתנתקות
function handleLogout() {
    const auth2 = gapi.auth2?.getAuthInstance();
    if (auth2) {
        auth2.signOut().then(() => {
            updateUIAfterLogout();
        });
    }
}

// עדכון ממשק אחרי התחברות
function updateUIAfterLogin(user) {
    if (!user) return;

    const loginButton = document.querySelector('.login-button');
    const userMenu = document.querySelector('.user-menu');
    const userAvatar = document.querySelector('.user-avatar');
    const userName = document.querySelector('.user-name');
    
    if (loginButton && userMenu && userAvatar && userName) {
        const profile = user.getBasicProfile();
        loginButton.style.display = 'none';
        userMenu.style.display = 'flex';
        userAvatar.src = profile.getImageUrl();
        userName.textContent = profile.getName();
    }
}

// עדכון ממשק אחרי התנתקות
function updateUIAfterLogout() {
    const loginButton = document.querySelector('.login-button');
    const userMenu = document.querySelector('.user-menu');
    
    if (loginButton && userMenu) {
        loginButton.style.display = 'flex';
        userMenu.style.display = 'none';
    }
}

// אתחול בטעינת הדף
document.addEventListener('DOMContentLoaded', initGoogleAuth); 