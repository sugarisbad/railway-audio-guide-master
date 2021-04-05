import json

from functools import wraps

from django.http import HttpResponse, HttpResponseNotFound

from app import settings
from railway.audio_response import RangedFileResponse
from railway.models import Station, Contact


def apikey_validate():
    def decorator(func):
        @wraps(func)
        def inner(request, *args, **kwargs):
            if 'HTTP_APIKEY' not in request.META or \
                    request.META.get('HTTP_APIKEY') != settings.FREE_SECRET_KEY and request.META.get('HTTP_APIKEY') != settings.PAID_SECRET_KEY:
                return HttpResponse(status=400)
            return func(request, *args, **kwargs)
        return inner
    return decorator


@apikey_validate()
def data_by_lang(request, lang):
    free = True if request.META.get('HTTP_APIKEY') == settings.FREE_SECRET_KEY else False
    result = []

    for station in Station.objects.filter(language=lang).order_by('order'):
        item = {
            'title': station.title,
            'image': station.get_base64_image()
        }
        '''
        If station is free or it's paid request 
        need show full station information
        '''
        if not free or station.free:
            item.update({
                'short_description': station.short_description,
                'additional_text': station.additional_text,
                'audioId': station.guid
            })

        result.append(item)

    return HttpResponse(json.dumps(result), content_type='application/json')


def contact_by_lang(request, lang):
    try:
        r = Contact.objects.values('content').get(language=lang)
        return HttpResponse(json.dumps(r), content_type='application/json')

    except Contact.DoesNotExist:
        return HttpResponseNotFound()


def audio_by_guid(request, lang, guid):
    if "APIKEY" not in request.GET or request.GET.get('APIKEY') != settings.FREE_SECRET_KEY and request.GET.get('APIKEY') != settings.PAID_SECRET_KEY:
        return HttpResponse(status=400)

    free = request.GET.get('APIKEY') == settings.FREE_SECRET_KEY

    try:
        free_filter = {}

        if free:
            free_filter['free'] = True

        r = Station.objects.get(guid=guid, language=lang, **free_filter)

        response = RangedFileResponse(request, open(r.audio.path, 'rb'), content_type='audio/wav')
        response['Content-Disposition'] = 'attachment; filename="%s"' % r.audio.path
        return response

    except Station.DoesNotExist:
        return HttpResponseNotFound()
