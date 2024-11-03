// קונפיגורציה
const NAV_CONFIG = {
    selectors: {
        burger: '.burger',
        nav: '.nav-links',
        header: 'header',
        menuItems: '.nav-links a'
    },
    classes: {
        active: 'nav-active',
        toggle: 'toggle',
        scrolled: 'scrolled'
    }
};

// אתחול הניווט
function initNavigation() {
    const elements = {
        burger: document.querySelector(NAV_CONFIG.selectors.burger),
        nav: document.querySelector(NAV_CONFIG.selectors.nav),
        header: document.querySelector(NAV_CONFIG.selectors.header),
        menuItems: document.querySelectorAll(NAV_CONFIG.selectors.menuItems)
    };

    if (!validateElements(elements)) return;

    setupEventListeners(elements);
    setupScrollBehavior(elements.header);
    markActiveMenuItem();
}

// וידוא שכל האלמנטים קיימים
function validateElements(elements) {
    const missingElements = Object.entries(elements)
        .filter(([key, element]) => !element && key !== 'menuItems')
        .map(([key]) => key);

    if (missingElements.length > 0) {
        console.error('חסרים אלמנטים בניווט:', missingElements.join(', '));
        return false;
    }
    return true;
}

// הגדרת מאזיני אירועים
function setupEventListeners(elements) {
    // טוגל תפריט במובייל
    elements.burger.addEventListener('click', () => {
        toggleMenu(elements);
    });

    // סגירת תפריט בלחיצה מחוץ לתפריט
    document.addEventListener('click', (event) => {
        if (!event.target.closest(NAV_CONFIG.selectors.nav) && 
            !event.target.closest(NAV_CONFIG.selectors.burger)) {
            closeMenu(elements);
        }
    });

    // סגירת תפריט בשינוי גודל מסך
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu(elements);
        }
    });

    // סגירת תפריט בניווט
    elements.menuItems?.forEach(item => {
        item.addEventListener('click', () => {
            closeMenu(elements);
        });
    });
}

// פתיחה/סגירה של התפריט
function toggleMenu(elements) {
    elements.nav.classList.toggle(NAV_CONFIG.classes.active);
    elements.burger.classList.toggle(NAV_CONFIG.classes.toggle);
    
    // מניעת גלילה כשהתפריט פתוח
    document.body.style.overflow = 
        elements.nav.classList.contains(NAV_CONFIG.classes.active) ? 'hidden' : '';
}

// סגירת התפריט
function closeMenu(elements) {
    elements.nav.classList.remove(NAV_CONFIG.classes.active);
    elements.burger.classList.remove(NAV_CONFIG.classes.toggle);
    document.body.style.overflow = '';
}

// התנהגות בגלילה
function setupScrollBehavior(header) {
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        // הוספת קלאס כשגוללים למטה
        if (currentScroll > 50) {
            header.classList.add(NAV_CONFIG.classes.scrolled);
        } else {
            header.classList.remove(NAV_CONFIG.classes.scrolled);
        }
        
        lastScroll = currentScroll;
    });
}

// סימון הדף הנוכחי בתפריט
function markActiveMenuItem() {
    const currentPath = window.location.pathname;
    const menuItems = document.querySelectorAll(NAV_CONFIG.selectors.menuItems);
    
    menuItems.forEach(item => {
        const href = item.getAttribute('href');
        if (href === currentPath || 
            (currentPath === '/' && href === 'index.html')) {
            item.classList.add('active');
        }
    });
}

// אתחול בטעינת הדף
document.addEventListener('DOMContentLoaded', initNavigation);
