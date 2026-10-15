from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Patient

User = get_user_model()

class RegistrationSerializer(serializers.Serializer):
    fullName = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    username = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8, trim_whitespace=False)

    def validate_username(self, value):
        if User.objects.filter(username__iexact=value).exists():
            raise serializers.ValidationError('This username is already in use.')
        return value

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        return value

class PatientSerializer(serializers.ModelSerializer):
    bloodGroup = serializers.ChoiceField(source='blood_group', choices=Patient.BLOOD_GROUP_CHOICES)
    emergencyContact = serializers.CharField(source='emergency_contact', required=False, allow_blank=True)

    class Meta:
        model = Patient
        fields = ['id','name','age','gender','phone','email','bloodGroup','status','address','emergencyContact','created_at','updated_at']
        read_only_fields = ['id','created_at','updated_at']

    def validate_age(self, value):
        if not 0 <= value <= 150:
            raise serializers.ValidationError('Age must be between 0 and 150.')
        return value

    def validate_phone(self, value):
        value = value.strip()
        if len(value) < 7:
            raise serializers.ValidationError('Enter a valid phone number.')
        return value
