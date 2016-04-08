from django.db import models
from autoslug import AutoSlugField
from jsonfield import JSONField
from django.conf import settings
from django.utils import timezone
from django.utils.safestring import mark_safe

class Course(models.Model):
    name = models.CharField(max_length=200, null=False, blank=False)
    slug = AutoSlugField(populate_from='name', max_length=20, unique=True, db_index=True)
    data = JSONField(default=dict)

    def __str__(self):
        return self.name


class Deck(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=200, null=False, blank=False)
    slug = AutoSlugField(populate_from='name', max_length=20, unique_with=['course'], db_index=True)
    data = JSONField(default=dict)

    def __str__(self):
        return self.course.name + ': ' + self.name


class Slide(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, null=False, blank=False)
    slug = AutoSlugField(populate_from='title', max_length=20, unique_with=['deck'], db_index=True)
    content = models.TextField()
    data = JSONField(default=dict)

    def __str__(self):
        return str(self.title)

    def as_html(self):
        return mark_safe(self.content)


class Annotation(models.Model):
    slide = models.ForeignKey(Slide, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField(null=False)
    data = JSONField(default=dict)

    class Meta:
        unique_together = (('slide', 'order'),)


class SlideShow(models.Model):
    """
    Object representing an ongoing slide show.

    May be deleted when show ends (or last_touch indicates it's stale).
    """
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL)
    current_slide = models.ForeignKey(Slide, on_delete=models.CASCADE)
    last_touch = models.DateTimeField(null=False, blank=False, default=timezone.now)
    data = JSONField(default=dict)

