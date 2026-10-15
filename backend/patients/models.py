from django.db import models

class Patient(models.Model):
    GENDER_CHOICES = [('Male','Male'),('Female','Female'),('Other','Other')]
    STATUS_CHOICES = [('Admitted','Admitted'),('Discharged','Discharged'),('Under Review','Under Review')]
    BLOOD_GROUP_CHOICES = [(x,x) for x in ['A+','A-','B+','B-','AB+','AB-','O+','O-']]
    name = models.CharField(max_length=150, db_index=True)
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    phone = models.CharField(max_length=30, db_index=True)
    email = models.EmailField(blank=True)
    blood_group = models.CharField(max_length=3, choices=BLOOD_GROUP_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Under Review')
    address = models.TextField(blank=True)
    emergency_contact = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.name} (#{self.pk})'
