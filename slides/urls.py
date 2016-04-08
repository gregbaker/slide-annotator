from django.conf.urls import url, include
from . import views
urlpatterns = [
    url(r'^$', views.index),
    url(r'^(?P<course_slug>[\w\-]+)/(?P<deck_slug>[\w\-]+)$', views.deck),
    url(r'^(?P<course_slug>[\w\-]+)/(?P<deck_slug>[\w\-]+)/(?P<slide_slug>[\w\-]+)$', views.deck),
]