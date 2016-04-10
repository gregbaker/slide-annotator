from django.conf.urls import url, include
from . import views

def slugs(*args):
    return tuple(r'(?P<%s_slug>[\w\-]+)' % (a,) for a in args)

urlpatterns = [
    url(r'^$', views.index),
    url(r'^%s/%s$' % slugs('course', 'deck'), views.deck),
    url(r'^%s/%s/%s$' % slugs('course', 'deck', 'slide'), views.deck),
    url(r'^%s/%s/%s/data$' % slugs('course', 'deck', 'slide'), views.slide_data),
]
