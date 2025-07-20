from rest_framework import serializers
from django.contrib.auth.models import User
from .models import StudyGroup, Membership, Message, Task

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']

class StudyGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudyGroup
        fields = '__all__'

class MembershipSerializer(serializers.ModelSerializer):
    group_details = StudyGroupSerializer(source='group', read_only=True)
    
    class Meta:
        model = Membership
        fields = ['id', 'user', 'group', 'group_details', 'joined_at']

class MessageSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'user', 'group', 'content', 'timestamp']

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = '__all__' 