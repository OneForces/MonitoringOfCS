# Generated by Django 5.2.3 on 2025-06-20 18:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('servers', '0008_downloadstat'),
    ]

    operations = [
        migrations.AddField(
            model_name='server',
            name='votes_count',
            field=models.PositiveIntegerField(default=0),
        ),
    ]
