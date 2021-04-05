# Generated by Django 2.0.5 on 2018-05-15 16:40

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Station',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('order', models.PositiveIntegerField(verbose_name='Сортировка')),
                ('language', models.CharField(choices=[('ru', 'ru'), ('en', 'en'), ('de', 'de'), ('cn', 'ru')], max_length=2)),
                ('published', models.BooleanField(verbose_name='Опубликовано')),
                ('free', models.BooleanField(verbose_name='Доступна бесплатно')),
                ('title', models.CharField(max_length=80, verbose_name='Название станции')),
                ('image', models.ImageField(upload_to='station')),
                ('short_description', models.TextField(blank=True, help_text='Отображается под аудиозаписью', verbose_name='Короткое описание')),
                ('additional_text', models.TextField(blank=True, help_text='Отображается при свайпе картинки', verbose_name='Дополнительный текст')),
                ('audio', models.FileField(upload_to='audio', verbose_name='Аудио запись')),
                ('guid', models.CharField(db_index=True, editable=False, max_length=60, unique=True)),
            ],
            options={
                'verbose_name': 'Станция',
                'verbose_name_plural': 'Станции',
            },
        ),
        migrations.AlterUniqueTogether(
            name='station',
            unique_together={('language', 'order')},
        ),
    ]
