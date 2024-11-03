document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');
    
    if (searchQuery) {
        document.getElementById('search-input').value = searchQuery;
        performSearch(searchQuery);
    } else {
        loadBooks();
    }

    // הוספת מאזיני אירועים
    setupEventListeners();
});

function setupEventListeners() {
    // חיפוש בלחיצה על Enter
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // חיפוש בלחיצה על כפתור החיפוש
    document.querySelector('.search-btn')?.addEventListener('click', handleSearch);
}

function handleSearch() {
    const searchTerm = document.getElementById('search-input').value.trim();
    if (searchTerm) {
        performSearch(searchTerm);
    } else {
        loadBooks();
    }
}

function performSearch(query) {
    const books = JSON.parse(localStorage.getItem('books') || '[]');
    console.log('מחפש:', query);
    console.log('מספר ספרים במאגר:', books.length);
    
    const searchTerm = query.toLowerCase();
    const filteredBooks = books.filter(book => {
        const bookTitle = book.title.toLowerCase();
        const bookAuthor = book.author.toLowerCase();
        
        return bookTitle.includes(searchTerm) || bookAuthor.includes(searchTerm);
    });
    
    displayResults(filteredBooks);
}

function displayResults(books) {
    const booksListElement = document.getElementById('booksList');
    if (!booksListElement) return;
    
    if (books.length === 0) {
        booksListElement.innerHTML = '<p class="no-books">לא נמצאו ספרים התואמים לחיפוש</p>';
        return;
    }
    
    console.log('נמצאו:', books.length, 'ספרים');
    
    booksListElement.innerHTML = books.map(book => `
        <div class="book-card">
            <img src="${book.image}" alt="${book.title}" onerror="this.src='placeholder.jpg'">
            <div class="book-info">
                <h3>${book.title}</h3>
                <p class="author">מאת: ${book.author}</p>
                <p class="publisher">הוצאת: ${book.publisher}</p>
                <p class="price">₪${book.price}</p>
                <button onclick="showBookDetails('${book.id}')" class="details-btn">פרטים נוספים</button>
                <button onclick="addToCart('${book.id}', '${book.title}', ${book.price})" class="add-to-cart-btn">
                    הוסף לסל
                </button>
            </div>
        </div>
    `).join('');
}

function displayError(message) {
    const resultsContainer = document.getElementById('search-results');
    if (!resultsContainer) return;

    resultsContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

// גרסה פשוטה יותר של פונקציית החיפוש
async function searchBooks(query) {
    try {
        const response = await fetch('./data/books.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const books = await response.json();
        
        const results = books.filter(book => 
            book.title.includes(query) || 
            book.author.includes(query)
        );
        
        return results;
    } catch (error) {
        console.error('Search error:', error);
        throw error;
    }
}

// טיפול בתצוגת השגיאה
function handleSearchError(error) {
    const resultsContainer = document.getElementById('search-results');
    if (resultsContainer) {
        resultsContainer.innerHTML = `
            <div class="error-message">
                <p>מצטערים, אירעה שגיאה בחיפוש</p>
                <p>אנא נסו שוב מאוחר יותר</p>
            </div>
        `;
    }
}