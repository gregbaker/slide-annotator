from django.conf.urls import url, include
from rest_framework import routers
from . import views
from . import api_views


def slugs(*args):
    return tuple(r'(?P<%s_slug>[\w\-]+)' % (a,) for a in args)


router = routers.DefaultRouter()
router.register(r'slide-data', api_views.SlideViewSet)
router.register(r'annotations/(?P<slide_pk>\d+)', api_views.AnnotationViewSet)

urlpatterns = [
    url(r'^api/', include(router.urls)),

    url(r'^$', views.index),
    url(r'^%s/%s$' % slugs('course', 'deck'), views.deck),
    url(r'^%s/%s/%s$' % slugs('course', 'deck', 'slide'), views.deck),
]
