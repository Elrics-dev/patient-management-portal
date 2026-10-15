from django.contrib import admin
from .models import Patient

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('id','name','age','gender','phone','blood_group','status','created_at')
    list_filter = ('status','gender','blood_group')
    search_fields = ('name','phone','email')
