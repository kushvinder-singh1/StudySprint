from django.contrib import admin
from django.urls import path, include
from django.http import HttpResponse

def home(request):
    return HttpResponse("Welcome to the StudySprint API.")

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
]
