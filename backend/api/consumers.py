from channels.generic.websocket import AsyncWebsocketConsumer
import json
from .models import Message, StudyGroup
from django.contrib.auth import get_user_model
from asgiref.sync import sync_to_async

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_id = self.scope['url_route']['kwargs']['group_id']
        self.group_name = f'chat_{self.group_id}'
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data['message']
        user = self.scope['user'] if self.scope['user'].is_authenticated else None
        await self.save_message(user, self.group_id, message)
        await self.channel_layer.group_send(
            self.group_name,
            {
                'type': 'chat_message',
                'message': message,
                'user': user.username if user else 'Anonymous'
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'message': event['message'],
            'user': event['user']
        }))

    @sync_to_async
    def save_message(self, user, group_id, content):
        group = StudyGroup.objects.get(id=group_id)
        Message.objects.create(user=user, group=group, content=content) 