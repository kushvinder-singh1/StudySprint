import os
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from channels.auth import AuthMiddlewareStack
from django.urls import path
from api.consumers import ChatConsumer

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sprint.settings')

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': AuthMiddlewareStack(
        URLRouter([
            path('ws/chat/<int:group_id>/', ChatConsumer.as_asgi()),
        ])
    ),
})
