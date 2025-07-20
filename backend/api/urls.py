from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import UserViewSet, StudyGroupViewSet, MembershipViewSet, MessageViewSet, TaskViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'groups', StudyGroupViewSet)
router.register(r'memberships', MembershipViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'tasks', TaskViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
] 