from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from .models import StudyGroup, Membership, Message, Task
from .serializers import UserSerializer, StudyGroupSerializer, MembershipSerializer, MessageSerializer, TaskSerializer
from django.db import IntegrityError

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class StudyGroupViewSet(viewsets.ModelViewSet):
    queryset = StudyGroup.objects.all()
    serializer_class = StudyGroupSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = StudyGroup.objects.all()
        subject = self.request.query_params.get('subject', None)
        goal = self.request.query_params.get('goal', None)
        exam_date = self.request.query_params.get('exam_date', None)
        
        if subject:
            queryset = queryset.filter(subject__icontains=subject)
        if goal:
            queryset = queryset.filter(goal__icontains=goal)
        if exam_date:
            queryset = queryset.filter(exam_date=exam_date)
        
        return queryset

class MembershipViewSet(viewsets.ModelViewSet):
    queryset = Membership.objects.all()
    serializer_class = MembershipSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Membership.objects.filter(user=self.request.user)

    def create(self, request, *args, **kwargs):
        try:
            return super().create(request, *args, **kwargs)
        except IntegrityError:
            existing_membership = Membership.objects.filter(
                user=request.user,
                group_id=request.data.get('group')
            ).first()
            if existing_membership:
                serializer = self.get_serializer(existing_membership)
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response({'error': 'Membership already exists'}, status=status.HTTP_400_BAD_REQUEST)

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group', None)
        if group_id:
            return Message.objects.filter(group_id=group_id)
        return Message.objects.none()

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        group_id = self.request.query_params.get('group', None)
        if group_id:
            return Task.objects.filter(group_id=group_id)
        return Task.objects.filter(user=self.request.user)
