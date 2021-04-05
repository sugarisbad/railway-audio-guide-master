# Generated by Django 2.0.5 on 2018-05-15 17:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('railway', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Contact',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('language', models.CharField(choices=[('ru', 'ru'), ('en', 'en'), ('de', 'de'), ('cn', 'ru')], max_length=2, unique=True)),
                ('content', models.TextField()),
            ],
            options={
                'verbose_name_plural': 'Контактная информация',
                'verbose_name': 'Контактная информация',
            },
        ),
    ]