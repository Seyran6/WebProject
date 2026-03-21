from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.shortcuts import redirect
from .vk_utils import vk_send

def index(request):
    return render(request, "index.html")

def feed(request):
    return render(request, "feedback.html")

def book(request):
    id = request.GET.get("id")
    return render(request, "book.html", {"id":id})


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