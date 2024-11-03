// ניהול סל קניות
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// הוספה לסל
function addToCart(bookId) {
    cart.push(bookId);
    updateCartCount();
    saveCart();
    showNotification('הספר נוסף לסל הקניות!');
}

// עדכון מספר פריטים בסל
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

// שמירת הסל בזיכרון המקומי
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function removeFromCart(bookId) {
    const index = cart.indexOf(bookId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartCount();
        saveCart();
    }
}

function clearCart() {
    cart = [];
    updateCartCount();
    saveCart();
}

function getCartTotal() {
    // כאן תוסיף חישוב של סך הכל
    return cart.reduce((total, bookId) => {
        const book = findBookById(bookId);
        return total + (book ? book.price : 0);
    }, 0);
}

async function checkout() {
    if (cart.length === 0) {
        alert('סל הקניות ריק');
        return;
    }
    
    const checkoutButton = document.getElementById('checkout-button');
    if (checkoutButton) {
        checkoutButton.disabled = true;
        checkoutButton.classList.add('loading');
    }
    
    try {
        // כאן יבוא קוד התשלום האמיתי
        await processPayment(cart);
        clearCart();
        alert('התשלום בוצע בהצלחה!');
    } catch (error) {
        console.error('שגיאה בתשלום:', error);
        alert('אירעה שגיאה בתהליך התשלום. אנא נסה שוב.');
    } finally {
        if (checkoutButton) {
            checkoutButton.disabled = false;
            checkoutButton.classList.remove('loading');
        }
    }
}

// בדיקת הרשאות מנהל
function checkAdminAccess() {
    // כאן צריך להוסיף לוגיקה אמיתית לבדיקת הרשאות
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    const adminLink = document.querySelector('.admin-link');
    
    if (adminLink) {
        adminLink.style.display = isAdmin ? 'block' : 'none';
    }
}

// הפעלת הבדיקה בטעינת הדף
document.addEventListener('DOMContentLoaded', checkAdminAccess);

// הוסף לקובץ books.js או לתגית script בדף
async function fetchBooksFromAPI() {
    try {
        // חיפוש ספרים בעברית
        const query = 'language:hebrew';
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=40&langRestrict=he`);
        const data = await response.json();
        
        // המרת הנתונים לפורמט שלנו
        const books = data.items.map(book => ({
            id: book.id,
            title: book.volumeInfo.title || 'ללא כותרת',
            author: book.volumeInfo.authors ? book.volumeInfo.authors.join(', ') : 'מחבר לא ידוע',
            price: generateRandomPrice(), // פונקציית עזר ליצירת מחיר
            image: book.volumeInfo.imageLinks?.thumbnail || 'placeholder.jpg',
            description: book.volumeInfo.description || 'אין תיאור זמין',
            publisher: book.volumeInfo.publisher || 'הוצאה לא ידועה',
            publishedDate: book.volumeInfo.publishedDate || 'תאריך לא ידוע',
            pageCount: book.volumeInfo.pageCount || 'מספר עמודים לא ידוע'
        }));

        // שמירה ב-localStorage
        localStorage.setItem('books', JSON.stringify(books));
        
        // טעינת הספרים לדף
        loadBooks();
        
    } catch (error) {
        console.error('שגיאה בטעינת ספרים:', error);
    }
}

// פונקציית עזר ליצירת מחיר אקראי
function generateRandomPrice() {
    return Math.floor(Math.random() * (150 - 50) + 50); // מחיר בין 50 ל-150 ש"ח
}

// עדכון פונקציית loadBooks
function loadBooks() {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const booksListElement = document.getElementById('booksList');
    
    if (books.length === 0) {
        booksListElement.innerHTML = '<p class="no-books">טוען ספרים...</p>';
        fetchBooksFromAPI(); // טעינה ראשונית מה-API
        return;
    }
    
    booksListElement.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" onerror="this.src='placeholder.jpg'">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">מאת: ${book.author}</p>
                <p class="publisher">הוצאת: ${book.publisher}</p>
                <p class="price">₪${book.price}</p>
                <div class="book-details">
                    <p class="pages">עמודים: ${book.pageCount}</p>
                    <p class="date">תאריך הוצאה: ${book.publishedDate}</p>
                </div>
                <button onclick="showBookDetails('${book.id}')" class="details-btn">פרטים נוספים</button>
                <button onclick="addToCart('${book.id}', '${book.title}', ${book.price})" class="add-to-cart-btn">
                    הוסף לסל
                </button>
            </div>
        </div>
    `).join('');
}

// פונקציה להצגת פרטים נוספים
function showBookDetails(bookId) {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    const book = books.find(b => b.id === bookId);
    
    if (!book) return;
    
    const modal = document.createElement('div');
    modal.className = 'book-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <h2>${book.title}</h2>
            <img src="${book.image}" alt="${book.title}">
            <p class="description">${book.description}</p>
            <div class="book-metadata">
                <p><strong>מחבר:</strong> ${book.author}</p>
                <p><strong>הוצאה:</strong> ${book.publisher}</p>
                <p><strong>תאריך:</strong> ${book.publishedDate}</p>
                <p><strong>עמודים:</strong> ${book.pageCount}</p>
            </div>
            <button onclick="addToCart('${book.id}', '${book.title}', ${book.price})" class="add-to-cart-btn">
                הוסף לסל - ₪${book.price}
            </button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').onclick = () => {
        document.body.removeChild(modal);
    };
}