from .models import Slide, Annotation
from rest_framework import viewsets
from .serializers import SlideSerializer, AnnotationSerializer


class SlideViewSet(viewsets.ModelViewSet):
    queryset = Slide.objects.all()
    serializer_class = SlideSerializer


class AnnotationViewSet(viewsets.ModelViewSet):
    queryset = Annotation.objects.all()
    serializer_class = AnnotationSerializer

    def get_queryset(self):
        slide_pk = self.kwargs['slide_pk']
        return Annotation.objects.filter(slide_id=slide_pk)

    def perform_create(self, serializer):
        serializer.save(slide_id=self.kwargs['slide_pk'], id=None)
