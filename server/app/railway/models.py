# coding: utf-8
import base64
import uuid

try:
    from StringIO import StringIO
except ImportError:
    from io import StringIO, BytesIO

from PIL import Image, ImageFilter
from django.db import models

LANG_CHOICES = (
    ('ru', 'ru'),
    ('en', 'en'),
    ('de', 'de'),
    ('cn', 'cn'),
)


class Station(models.Model):
    order = models.PositiveIntegerField(verbose_name=u'Сортировка')
    language = models.CharField(verbose_name=u'Язык', max_length=2, choices=LANG_CHOICES)
    published = models.BooleanField(verbose_name=u'Опубликовано')

    free = models.BooleanField(verbose_name=u'Доступна бесплатно')
    title = models.CharField(max_length=80, verbose_name=u'Название станции')
    image = models.ImageField(upload_to='station')
    short_description = models.TextField(blank=True, verbose_name=u'Короткое описание', help_text=u'Отображается под аудиозаписью')
    additional_text = models.TextField(blank=True, verbose_name=u'Дополнительный текст', help_text=u'Отображается при свайпе картинки')
    audio = models.FileField(verbose_name=u'Аудио запись', upload_to='audio')

    guid = models.CharField(max_length=60, db_index=True, editable=False, unique=True)

    class Meta:
        unique_together = ("language", "order")
        verbose_name = u"Станция"
        verbose_name_plural = u"Станции"

    def save(self, force_insert=False, force_update=False, using=None,
             update_fields=None):

        if not self.guid:
            self.guid = str(uuid.uuid1())

        super(Station, self).save(force_update=force_update, force_insert=force_insert,
                                  using=using, update_fields=update_fields)

    def get_base64_image(self):
        image = Image.open(self.image.file)

        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        return u'data:image/jpeg;base64,%s' % base64.b64encode(buffer.getvalue()).decode()


class Contact(models.Model):
    language = models.CharField(verbose_name=u'Язык', max_length=2, choices=LANG_CHOICES, unique=True)
    content = models.TextField(verbose_name=u'Контент')

    class Meta:
        verbose_name = u"Контактная информация"
        verbose_name_plural = u"Контактная информация"
