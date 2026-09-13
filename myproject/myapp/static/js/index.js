// index.js
const books = [
    {id:1, title:"Книга 1", price:500, src:"https://avatars.mds.yandex.net/get-mpic/4984138/2a000001920666d3114b64a0ac5da2f29fcf/orig"},
    {id:2, title:"Книга 2", price:450, src:"https://avatars.mds.yandex.net/get-mpic/11368503/2a000001961a061fd469be1a33e80763c5d0/orig"},
    {id:3, title:"Книга 3", price:600, src:"https://avatars.mds.yandex.net/get-mpic/12263081/2a00000194ffed26f9b4bf89bfc67f7d8565/orig"},
    {id:4, title:"Книга 4", price:550, src:"https://avatars.mds.yandex.net/get-mpic/15434382/2a00000197885f8cd868f2238734b35c2070/orig"},
    {id:5, title:"Книга 5", price:700, src:"https://ir.ozone.ru/s3/multimedia-1-s/7436653336.jpg"},
    {id:6, title:"Книга 6", price:480, src:"https://static10.labirint.ru/books/499852/cover.jpg"},
    {id:7, title:"Книга 7", price:520, src:"https://avatars.mds.yandex.net/get-mpic/4428744/2a00000190efdb1134ede2e5773a758044c8/orig"},
    {id:8, title:"Книга 8", price:650, src:"https://avatars.mds.yandex.net/get-mpic/12641020/2a0000018f966a8d96a1e3dcaa2ad6fc8a8e/orig"},
];

document.addEventListener("DOMContentLoaded", function () {
    const container = document.querySelector(".row.g-4");
    container.innerHTML = books.map(book => `
        <div class="col-md-3">
            <div class="card h-100 shadow-sm">
                <img src="${book.src}" class="card-img-custom">
                <div class="card-body d-flex flex-column">
                    <h5>${book.title}</h5>
                    <p>${book.price} ₽</p>
                    <div class="d-grid gap-2 mt-auto">
                        <a href="/book?id=${book.id}" class="btn btn-primary">Подробнее</a>
                        <button class="btn btn-success add-to-cart-btn" data-book-id="${book.id}" data-title="${book.title}" data-price="${book.price}">В корзину</button>
                    </div>
                </div>
            </div>
        </div>
    `).join("");

    // Обработчики кнопок "В корзину"
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const bookId = this.dataset.bookId;
            const title = this.dataset.title;
            const price = this.dataset.price;
            
            fetch('/api/cart/add/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': getCookie('csrftoken')
                },
                body: JSON.stringify({
                    book_id: parseInt(bookId),
                    quantity: 1
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    updateCartBadge();
                    alert(`${title} добавлен в корзину!`);
                } else {
                    alert('Ошибка при добавлении в корзину');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Ошибка при добавлении в корзину');
            });
        });
    });
});

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