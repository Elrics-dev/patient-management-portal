from django.contrib.auth import authenticate, get_user_model
from django.db import transaction
from django.db.models import Q
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Patient
from .serializers import PatientSerializer, RegistrationSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        # Assessment requirement: public registration is only available for the first administrator.
        with transaction.atomic():
            if User.objects.select_for_update().exists():
                return Response({'detail':'Initial administrator already exists. Ask an administrator to create accounts.'}, status=status.HTTP_403_FORBIDDEN)
            data = serializer.validated_data
            full_name = data['fullName'].strip()
            parts = full_name.split(maxsplit=1)
            user = User.objects.create_user(
                username=data['username'], email=data['email'], password=data['password'],
                first_name=parts[0], last_name=parts[1] if len(parts) > 1 else '', is_staff=True,
            )
        return Response({'id':user.id,'username':user.username,'detail':'Administrator created successfully.'}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '')
        user = authenticate(request, username=username, password=password)
        if not user or not user.is_active or not user.is_staff:
            return Response({'detail':'Invalid username or password.'}, status=status.HTTP_401_UNAUTHORIZED)
        refresh = RefreshToken.for_user(user)
        return Response({'access':str(refresh.access_token),'refresh':str(refresh),'user':{'username':user.username,'fullName':user.get_full_name() or user.username,'email':user.email}})

class MeView(APIView):
    def get(self, request):
        user = request.user
        return Response({'username':user.username,'fullName':user.get_full_name() or user.username,'email':user.email})

class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]

    def get_queryset(self):
        queryset = Patient.objects.all()
        query = self.request.query_params.get('search', '').strip()
        if query:
            queryset = queryset.filter(Q(name__icontains=query) | Q(phone__icontains=query) | Q(email__icontains=query) | Q(id__icontains=query))
        return queryset

class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated, permissions.IsAdminUser]
