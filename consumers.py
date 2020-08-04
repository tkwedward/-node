import json
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
from django.conf import settings


class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.room_name = self.scope['url_route']['kwargs']['room_name']
        self.room_group_name = 'chat_%s' % self.room_name
        self.scope["selfDefinedUserID"] = "CHAT_USER_" + str(settings.CHANNEL_USER_ID)
        settings.CHANNEL_USER_ID += 1

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        self.send(text_data=json.dumps({
            'action': "initial_message",
            'message': self.scope["selfDefinedUserID"]
        }))

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    # 從 client 接收 message
    def receive(self, text_data):
        text_data_json = json.loads(text_data)

        message = {
            'type': 'chat_message',
            'message':  text_data_json['message'],
            "action": text_data_json["action"]
        }
        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name, message
        )

    # Receive message from room group
    # 向 clients send 回 message
    def chat_message(self, event):
        message = event['message']
        action = event['action']

        # Send message to WebSocket, the message sends back to each user
        self.send(text_data=json.dumps({
            'message': message,
            "action": action
        }))
