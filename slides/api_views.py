from .models import Slide, Annotation
from rest_framework import viewsets
from .serializers import SlideSerializer, AnnotationSerializer


class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer

class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer

