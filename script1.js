function onSignIn(googleUser) {
    try {
        // הסתר את כפתור ההתחברות והצג את פרטי המשתמש
        const signInButton = document.querySelector('.g-signin2');
        const userInfo = document.getElementById('user-info');
        
        if (!signInButton || !userInfo) {
            console.error('חסרים אלמנטים נדרשים בדף');
            return;
        }

        signInButton.style.display = 'none';
        userInfo.style.display = 'flex';
        
        // הצג את שם המשתמש
        const profile = googleUser.getBasicProfile();
        const userName = document.getElementById('user-name');
        if (userName) {
            userName.textContent = `שלום, ${profile.getName()}`;
        }

        // שמירת מצב המשתמש
        saveUserState(profile);
        
    } catch (error) {
        console.error('שגיאה בהתחברות:', error);
        alert('אירעה שגיאה בתהליך ההתחברות. אנא נסה שוב.');
    }
}

async function signOut() {
    try {
        const auth2 = gapi.auth2.getAuthInstance();
        if (!auth2) {
            throw new Error('מופע Google Auth לא נמצא');
        }

        await auth2.signOut();
        
        // ניקוי ממשק המשתמש
        const signInButton = document.querySelector('.g-signin2');
        const userInfo = document.getElementById('user-info');
        const userName = document.getElementById('user-name');
        
        if (signInButton) signInButton.style.display = 'block';
        if (userInfo) userInfo.style.display = 'none';
        if (userName) userName.textContent = '';
        
        // ניקוי נתוני המשתמש מהאחסון המקומי
        localStorage.removeItem('userData');
        
        // אירוע התנתקות מותאם
        dispatchLogoutEvent();
        
    } catch (error) {
        console.error('שגיאה בהתנתקות:', error);
        alert('אירעה שגיאה בתהליך ההתנתקות. אנא נסה שוב.');
    }
}

function dispatchLogoutEvent() {
    const event = new CustomEvent('userLoggedOut');
    document.dispatchEvent(event);
}

function saveUserState(profile) {
    const userData = {
        id: profile.getId(),
        name: profile.getName(),
        email: profile.getEmail(),
        imageUrl: profile.getImageUrl(),
        timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('userData', JSON.stringify(userData));
}

// בדיקת מצב התחברות בטעינת הדף
document.addEventListener('DOMContentLoaded', () => {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        const userInfo = document.getElementById('user-info');
        const signInButton = document.querySelector('.g-signin2');
        
        if (userInfo && signInButton) {
            signInButton.style.display = 'none';
            userInfo.style.display = 'flex';
            document.getElementById('user-name').textContent = `שלום, ${user.name}`;
        }
    }
});

// האזנה לאירועי התחברות/התנתקות
document.addEventListener('userLoggedOut', () => {
    // ניקוי נתונים או ביצוע פעולות נוספות בעת התנתקות
    clearCart(); // אם רלוונטי
});