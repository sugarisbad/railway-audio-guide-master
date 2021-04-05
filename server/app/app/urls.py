from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include

admin.site.site_header = u'Railway audio guide'
admin.site.site_title = u'Railway audio guide'

urlpatterns = [
    path('robots.txt', lambda r: HttpResponse("User-agent: *\nDisallow: /", content_type="text/plain")),
    path('admin/', admin.site.urls),
    path('api/', include('railway.urls')),
]
