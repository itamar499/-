document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navUl = document.querySelector('nav ul');

    if (menuToggle && navUl) {
        menuToggle.addEventListener('click', () => {
            navUl.classList.toggle('active');
        });
    }

    // סגירת תפריט בלחיצה מחוץ
    document.addEventListener('click', (event) => {
        const nav = document.querySelector('nav');
        if (nav && !nav.contains(event.target)) {
            navUl?.classList.remove('active');
        }
    });
});