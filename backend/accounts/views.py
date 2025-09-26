from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .serializers import RegisterSerializer, UserSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

# ---------------- Signup Endpoint ----------------
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # JWT tokens generate karo
        refresh = RefreshToken.for_user(user)
        access = str(refresh.access_token)

        return Response(
            {
                "user": UserSerializer(user).data,
                "message": "User registered successfully",
                "refresh": str(refresh),
                "access": access,
            },
            status=status.HTTP_201_CREATED
        )

# ---------------- JWT Login Endpoint ----------------
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # extra info JWT me dalna ho to yahan karo
        token['username'] = user.username
        return token

class MyTokenObtainPairView(TokenObtainPairView):
    permission_classes = [AllowAny]   # 👈 zaroori hai warna Unauthorized aayega
    serializer_class = MyTokenObtainPairSerializer
