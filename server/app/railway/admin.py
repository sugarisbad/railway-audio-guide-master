from django.contrib import admin

from railway.models import Station, Contact


class StationAdmin(admin.ModelAdmin):
    list_filter = ('language', 'published', 'free',)
    list_display = ('title', 'language', 'free', 'published', 'order',)
    ordering = ('order',)


admin.site.register(Station, StationAdmin)


class ContactAdmin(admin.ModelAdmin):
    list_display = ('language',)


admin.site.register(Contact, ContactAdmin)