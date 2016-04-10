from django.contrib import admin
from .models import Course, Deck, Slide, Annotation, SlideShow

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    exclude = ('data',)

@admin.register(Deck)
class DeckAdmin(admin.ModelAdmin):
    exclude = ('data',)

@admin.register(Slide)
class SlideAdmin(admin.ModelAdmin):
    exclude = ('data',)

@admin.register(Annotation)
class AnnotationAdmin(admin.ModelAdmin):
    pass

@admin.register(SlideShow)
class SlideShowAdmin(admin.ModelAdmin):
    exclude = ('data',)
