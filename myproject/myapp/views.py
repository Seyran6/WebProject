from django.http import HttpResponse, JsonResponse
from django.shortcuts import render, redirect
from .vk_utils import vk_send
import json

# Данные о книгах (в реальном проекте это будет из БД)
BOOKS = {
    1: {"title": "Книга 1", "author": "Автор1", "price": 500, "description": "Описание первой книги.", "src": "https://avatars.mds.yandex.net/get-mpic/4984138/2a000001920666d3114b64a0ac5da2f29fcf/orig"},
    2: {"title": "Книга 2", "author": "Автор2", "price": 450, "description": "Описание второй книги.", "src": "https://avatars.mds.yandex.net/get-mpic/11368503/2a000001961a061fd469be1a33e80763c5d0/orig"},
    3: {"title": "Книга 3", "author": "Автор3", "price": 420, "description": "Описание третьей книги.", "src": "https://avatars.mds.yandex.net/get-mpic/12263081/2a00000194ffed26f9b4bf89bfc67f7d8565/orig"},
    4: {"title": "Книга 4", "author": "Автор4", "price": 550, "description": "Описание четвертой книги.", "src": "https://avatars.mds.yandex.net/get-mpic/15434382/2a00000197885f8cd868f2238734b35c2070/orig"},
    5: {"title": "Книга 5", "author": "Автор5", "price": 700, "description": "Описание пятой книги.", "src": "https://ir.ozone.ru/s3/multimedia-1-s/7436653336.jpg"},
    6: {"title": "Книга 6", "author": "Автор6", "price": 480, "description": "Описание шестой книги.", "src": "https://static10.labirint.ru/books/499852/cover.jpg"},
    7: {"title": "Книга 7", "author": "Автор7", "price": 520, "description": "Описание седьмой книги.", "src": "https://avatars.mds.yandex.net/get-mpic/4428744/2a00000190efdb1134ede2e5773a758044c8/orig"},
    8: {"title": "Книга 8", "author": "Автор8", "price": 650, "description": "Описание восьмой книги.", "src": "https://avatars.mds.yandex.net/get-mpic/12641020/2a0000018f966a8d96a1e3dcaa2ad6fc8a8e/orig"}
}

def index(request):
    return render(request, "index.html")

def feed(request):
    return render(request, "feedback.html")

def book(request):
    id = request.GET.get("id")
    return render(request, "book.html", {"id": id})

def cart(request):
    """Страница корзины"""
    return render(request, "cart.html")

def add_to_cart(request):
    """Добавление товара в корзину (через сессию)"""
    if request.method == 'POST':
        data = json.loads(request.body)
        book_id = int(data.get('book_id'))
        quantity = int(data.get('quantity', 1))
        
        if book_id not in BOOKS:
            return JsonResponse({'status': 'error', 'message': 'Книга не найдена'})
        
        # Получаем текущую корзину из сессии
        cart = request.session.get('cart', {})
        
        book = BOOKS[book_id]
        book_key = str(book_id)
        
        if book_key in cart:
            cart[book_key]['quantity'] += quantity
        else:
            cart[book_key] = {
                'book_id': book_id,
                'title': book['title'],
                'price': book['price'],
                'src': book['src'],
                'quantity': quantity
            }
        
        request.session['cart'] = cart
        request.session.modified = True
        
        # Считаем общее количество товаров
        total_items = sum(item['quantity'] for item in cart.values())
        
        return JsonResponse({
            'status': 'success',
            'total_items': total_items,
            'cart': cart
        })
    
    return JsonResponse({'status': 'error', 'message': 'Метод не разрешен'})

def get_cart(request):
    """Получение содержимого корзины"""
    cart = request.session.get('cart', {})
    total_items = sum(item['quantity'] for item in cart.values())
    total_price = sum(item['price'] * item['quantity'] for item in cart.values())
    
    return JsonResponse({
        'status': 'success',
        'cart': cart,
        'total_items': total_items,
        'total_price': total_price
    })

def remove_from_cart(request):
    """Удаление товара из корзины"""
    if request.method == 'POST':
        data = json.loads(request.body)
        book_id = str(data.get('book_id'))
        
        cart = request.session.get('cart', {})
        
        if book_id in cart:
            del cart[book_id]
            request.session['cart'] = cart
            request.session.modified = True
        
        total_items = sum(item['quantity'] for item in cart.values())
        total_price = sum(item['price'] * item['quantity'] for item in cart.values())
        
        return JsonResponse({
            'status': 'success',
            'cart': cart,
            'total_items': total_items,
            'total_price': total_price
        })
    
    return JsonResponse({'status': 'error', 'message': 'Метод не разрешен'})

def update_cart_quantity(request):
    """Обновление количества товара в корзине"""
    if request.method == 'POST':
        data = json.loads(request.body)
        book_id = str(data.get('book_id'))
        quantity = int(data.get('quantity', 1))
        
        cart = request.session.get('cart', {})
        
        if book_id in cart and quantity > 0:
            cart[book_id]['quantity'] = quantity
            request.session['cart'] = cart
            request.session.modified = True
        elif quantity <= 0 and book_id in cart:
            del cart[book_id]
            request.session['cart'] = cart
            request.session.modified = True
        
        total_items = sum(item['quantity'] for item in cart.values())
        total_price = sum(item['price'] * item['quantity'] for item in cart.values())
        
        return JsonResponse({
            'status': 'success',
            'cart': cart,
            'total_items': total_items,
            'total_price': total_price
        })
    
    return JsonResponse({'status': 'error', 'message': 'Метод не разрешен'})

def checkout(request):
    """Оформление заказа"""
    if request.method == 'POST':
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '')
        phone = data.get('phone', '')
        
        cart = request.session.get('cart', {})
        
        if not cart:
            return JsonResponse({'status': 'error', 'message': 'Корзина пуста'})
        
        if not name or not email or not phone:
            return JsonResponse({'status': 'error', 'message': 'Заполните все поля'})
        
        # Создаем заказ в БД
        from .models import Order, OrderItem
        
        total_price = sum(item['price'] * item['quantity'] for item in cart.values())
        
        order = Order.objects.create(
            name=name,
            email=email,
            phone=phone,
            total_price=total_price
        )
        
        for item in cart.values():
            OrderItem.objects.create(
                order=order,
                book_id=item['book_id'],
                title=item['title'],
                price=item['price'],
                quantity=item['quantity']
            )
        
        # Очищаем корзину
        request.session['cart'] = {}
        request.session.modified = True
        
        return JsonResponse({
            'status': 'success',
            'order_id': order.id
        })
    
    return JsonResponse({'status': 'error', 'message': 'Метод не разрешен'})

def serv(request):
    if request.method == 'POST':
        name = request.POST.get("firstName", "")
        lastname = request.POST.get("lastName", "")
        email = request.POST.get("email", "")
        phone = request.POST.get("phone", "")
        message = request.POST.get("message", "")

        message = f"Новая заявка:\n{name} {lastname}\nEmail:\n{email}\nPhone:\n{phone}\nMessage:\n{message}"
        #vk_send(message)
        return redirect("success")

    return JsonResponse({"status": "error"})

def success(request):
    return render(request, "success.html")

def order_success(request, order_id):
    """Страница успешного оформления заказа"""
    return render(request, "order_success.html", {"order_id": order_id})