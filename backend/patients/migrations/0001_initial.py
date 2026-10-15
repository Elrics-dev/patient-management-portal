from django.db import migrations, models

class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [migrations.CreateModel(name='Patient', fields=[
        ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
        ('name', models.CharField(db_index=True, max_length=150)),
        ('age', models.PositiveSmallIntegerField()),
        ('gender', models.CharField(choices=[('Male','Male'),('Female','Female'),('Other','Other')], max_length=10)),
        ('phone', models.CharField(db_index=True, max_length=30)),
        ('email', models.EmailField(blank=True, max_length=254)),
        ('blood_group', models.CharField(choices=[('A+','A+'),('A-','A-'),('B+','B+'),('B-','B-'),('AB+','AB+'),('AB-','AB-'),('O+','O+'),('O-','O-')], max_length=3)),
        ('status', models.CharField(choices=[('Admitted','Admitted'),('Discharged','Discharged'),('Under Review','Under Review')], default='Under Review', max_length=20)),
        ('address', models.TextField(blank=True)),
        ('emergency_contact', models.CharField(blank=True, max_length=160)),
        ('created_at', models.DateTimeField(auto_now_add=True)),
        ('updated_at', models.DateTimeField(auto_now=True)),
    ], options={'ordering':['-created_at']})]
