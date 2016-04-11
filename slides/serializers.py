from .models import Slide, Annotation
from rest_framework import serializers

# from http://stackoverflow.com/a/28200902/1236542
class JSONSerializerField(serializers.Field):
    """ Serializer for JSONField -- required to make field writable"""
    def to_internal_value(self, data):
        return data
    def to_representation(self, value):
        return value


class SlideSerializer(serializers.HyperlinkedModelSerializer):
    annotations = serializers.HyperlinkedRelatedField(view_name='annotation-detail', many=True, read_only=True)
    class Meta:
        model = Slide
        fields = ('id', 'title', 'slug', 'content', 'annotations')

class AnnotationSerializer(serializers.HyperlinkedModelSerializer):
    data = JSONSerializerField()
    class Meta:
        model = Annotation
        fields = ('id', 'slide', 'order', 'data')