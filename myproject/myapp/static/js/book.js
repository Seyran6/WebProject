document.addEventListener("DOMContentLoaded", function () {
    const books = {
        1:{title:"Книга 1",author:"Автор1",price:"500 ₽",description:"Описание первой книги.", src:"https://avatars.mds.yandex.net/get-mpic/4984138/2a000001920666d3114b64a0ac5da2f29fcf/orig"},
        2:{title:"Книга 2",author:"Автор2",price:"450 ₽",description:"Описание второй книги.", src:"https://avatars.mds.yandex.net/get-mpic/11368503/2a000001961a061fd469be1a33e80763c5d0/orig"},
        3:{title:"Книга 3",author:"Автор3",price:"420 ₽", description:"Описание третьей книги.", src:"https://avatars.mds.yandex.net/get-mpic/12263081/2a00000194ffed26f9b4bf89bfc67f7d8565/orig"},
        4:{title:"Книга 4",author:"Автор4",price:"550 ₽",description:"Описание четвертой книги.", src:"https://avatars.mds.yandex.net/get-mpic/15434382/2a00000197885f8cd868f2238734b35c2070/orig"},
        5:{title:"Книга 5",author:"Автор5",price:"700 ₽",description:"Описание пятой книги.", src:"https://ir.ozone.ru/s3/multimedia-1-s/7436653336.jpg"},
        6:{title:"Книга 6",author:"Автор6",price:"480 ₽",description:"Описание шестой книги.", src:"https://static10.labirint.ru/books/499852/cover.jpg"},
        7:{title:"Книга 7",author:"Автор7",price:"520 ₽",description:"Описание седьмой книги.", src:"https://avatars.mds.yandex.net/get-mpic/4428744/2a00000190efdb1134ede2e5773a758044c8/orig"},
        8:{title:"Книга 8",author:"Автор8",price:"650 ₽",description:"Описание восьмой книги.", src:"https://avatars.mds.yandex.net/get-mpic/12641020/2a0000018f966a8d96a1e3dcaa2ad6fc8a8e/orig"}
    };

    const content = document.getElementById("content");
    const id = parseInt(content.dataset.id);

    if (books[id]) {
        const book = books[id];
        content.innerHTML = `
            <div class="row">
                <div class="col-md-5">
                    <img src="${book.src}" class="img-fluid rounded shadow" style="max-width: 350px;">
                </div>
                <div class="col-md-7">
                    <h1>${book.title}</h1>
                    <p class="text-muted">Автор: ${book.author}</p>
                    <h3 class="text-primary">${book.price}</h3>
                    <p class="mt-4">${book.description}</p>
                    <button class="btn btn-success btn-lg mt-3">Купить</button>
                    <a href="/" class="btn btn-secondary btn-lg mt-3">Назад</a>
                </div>
            </div>
        `;
    }
});