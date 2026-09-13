// cart.js - Скрипт корзины

let currentCart = {};

document.addEventListener("DOMContentLoaded", function () {
    loadCart();
    
    // Обработчик кнопки очистки корзины
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            clearCart();
        }
    });
    
    // Обработчик кнопки оформления заказа
    document.getElementById('checkout-btn').addEventListener('click', function() {
        const checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'));
        checkoutModal.show();
    });
    
    // Обработчик подтверждения заказа
    document.getElementById('confirm-order-btn').addEventListener('click', function() {
        const name = document.getElementById('checkout-name').value.trim();
        const email = document.getElementById('checkout-email').value.trim();
        const phone = document.getElementById('checkout-phone').value.trim();
        
        if (!name || !email || !phone) {
            alert('Пожалуйста, заполните все поля');
            return;
        }
        
        fetch('/api/checkout/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCookie('csrftoken')
            },
            body: JSON.stringify({ name, email, phone })
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                window.location.href = `/order/success/${data.order_id}/`;
            } else {
                alert(data.message || 'Ошибка при оформлении заказа');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Ошибка при оформлении заказа');
        });
    });
});

function loadCart() {
    fetch('/api/cart/get/')
        .then(response => response.json())
        .then(data => {
            currentCart = data.cart || {};
            renderCart(data);
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('cart-container').innerHTML = '<p class="text-danger">Ошибка загрузки корзины</p>';
        });
}

function renderCart(data) {
    const cartContainer = document.getElementById('cart-container');
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    const books = {
        1:{title:"Книга 1", src:"https://avatars.mds.yandex.net/get-mpic/4984138/2a000001920666d3114b64a0ac5da2f29fcf/orig"},
        2:{title:"Книга 2", src:"https://avatars.mds.yandex.net/get-mpic/11368503/2a000001961a061fd469be1a33e80763c5d0/orig"},
        3:{title:"Книга 3", src:"https://avatars.mds.yandex.net/get-mpic/12263081/2a00000194ffed26f9b4bf89bfc67f7d8565/orig"},
        4:{title:"Книга 4", src:"https://avatars.mds.yandex.net/get-mpic/15434382/2a00000197885f8cd868f2238734b35c2070/orig"},
        5:{title:"Книга 5", src:"https://ir.ozone.ru/s3/multimedia-1-s/7436653336.jpg"},
        6:{title:"Книга 6", src:"https://static10.labirint.ru/books/499852/cover.jpg"},
        7:{title:"Книга 7", src:"https://avatars.mds.yandex.net/get-mpic/4428744/2a00000190efdb1134ede2e5773a758044c8/orig"},
        8:{title:"Книга 8", src:"https://avatars.mds.yandex.net/get-mpic/12641020/2a0000018f966a8d96a1e3dcaa2ad6fc8a8e/orig"}
    };
    
    cartContainer.style.display = 'none';
    
    if (data.total_items === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';
    
    let html = '';
    for (const [bookId, item] of Object.entries(currentCart)) {
        const book = books[item.book_id] || {title: item.title, src: item.src};
        const itemSum = item.price * item.quantity;
        
        html += `
            <tr>
                <td><img src="${item.src || book.src}" alt="${item.title}" style="width: 60px; height: 80px; object-fit: cover;" class="rounded"></td>
                <td>${item.title || book.title}</td>
                <td>${item.price} ₽</td>
                <td>
                    <div class="input-group" style="width: 120px;">
                        <button class="btn btn-outline-secondary btn-sm decrease-qty" data-book-id="${bookId}">-</button>
                        <input type="text" class="form-control form-control-sm text-center qty-input" value="${item.quantity}" data-book-id="${bookId}" readonly>
                        <button class="btn btn-outline-secondary btn-sm increase-qty" data-book-id="${bookId}">+</button>
                    </div>
                </td>
                <td>${itemSum} ₽</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm remove-item" data-book-id="${bookId}">Удалить</button>
                </td>
            </tr>
        `;
    }
    
    cartItems.innerHTML = html;
    cartTotal.textContent = data.total_price;
    
    // Добавляем обработчики для кнопок количества
    document.querySelectorAll('.decrease-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            const currentItem = currentCart[bookId];
            if (currentItem && currentItem.quantity > 1) {
                updateQuantity(bookId, currentItem.quantity - 1);
            } else {
                removeItem(bookId);
            }
        });
    });
    
    document.querySelectorAll('.increase-qty').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            const currentItem = currentCart[bookId];
            if (currentItem) {
                updateQuantity(bookId, currentItem.quantity + 1);
            }
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            removeItem(bookId);
        });
    });
}

function updateQuantity(bookId, quantity) {
    fetch('/api/cart/update/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ book_id: parseInt(bookId), quantity })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            currentCart = data.cart || {};
            renderCart(data);
            updateCartBadge();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function removeItem(bookId) {
    fetch('/api/cart/remove/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({ book_id: parseInt(bookId) })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            currentCart = data.cart || {};
            renderCart(data);
            updateCartBadge();
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function clearCart() {
    // Удаляем все элементы по очереди
    const bookIds = Object.keys(currentCart);
    let promises = [];
    
    for (const bookId of bookIds) {
        promises.push(
            fetch('/api/cart/remove/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({ book_id: parseInt(bookId) })
            })
        );
    }
    
    Promise.all(promises)
        .then(() => {
            currentCart = {};
            loadCart();
            updateCartBadge();
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}
