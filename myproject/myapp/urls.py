from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("feedback/", views.feed, name="feedback"),
    path("book/", views.book, name="book"),
    path("serv/", views.serv, name="serv"),
    path("success/", views.success, name="success"),
    path("cart/", views.cart, name="cart"),
    path("api/cart/add/", views.add_to_cart, name="add_to_cart"),
    path("api/cart/get/", views.get_cart, name="get_cart"),
    path("api/cart/remove/", views.remove_from_cart, name="remove_from_cart"),
    path("api/cart/update/", views.update_cart_quantity, name="update_cart_quantity"),
    path("api/checkout/", views.checkout, name="checkout"),
    path("order/success/<int:order_id>/", views.order_success, name="order_success"),
]