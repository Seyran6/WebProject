from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("feedback/", views.feed, name="feedback"),
    path("book/", views.book, name="book"),
    path("serv/", views.serv, name="serv"),
    path("success/", views.success, name="success"),
]