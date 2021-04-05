from django.urls import path

from . import views

urlpatterns = [
    path('<str:lang>/data', views.data_by_lang),
    path('<str:lang>/audio/<str:guid>', views.audio_by_guid),
    path('<str:lang>/contact', views.contact_by_lang),
]