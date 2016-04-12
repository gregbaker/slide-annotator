from django.db import models
from autoslug import AutoSlugField
from jsonfield import JSONField
from django.conf import settings
from django.db import transaction
from django.db.models import Max
from django.utils import timezone
from django.utils.safestring import mark_safe

STATUS_CHOICES = [
    ('A', 'Active'),
    ('D', 'Deleted'),
]

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
    order = models.PositiveSmallIntegerField(null=False)
    status = models.CharField(max_length=1, null=False, blank=False, choices=STATUS_CHOICES, default='A')
    data = JSONField(default=dict)

    class Meta:
        unique_together = (('course', 'order'),)
        ordering = ['order']

    def __str__(self):
        return self.course.name + ': ' + self.name


class Slide(models.Model):
    deck = models.ForeignKey(Deck, on_delete=models.CASCADE)
    title = models.CharField(max_length=200, null=False, blank=False)
    slug = AutoSlugField(populate_from='title', max_length=20, unique_with=['deck'], db_index=True)
    order = models.PositiveSmallIntegerField(null=False)
    content = models.TextField()
    status = models.CharField(max_length=1, null=False, blank=False, choices=STATUS_CHOICES, default='A')
    data = JSONField(default=dict)

    class Meta:
        unique_together = (('deck', 'order'),)
        ordering = ['order']

    def __str__(self):
        return str(self.title)

    def as_html(self):
        return mark_safe(self.content)

class Annotation(models.Model):
    slide = models.ForeignKey(Slide, on_delete=models.CASCADE, related_name='annotations')
    order = models.PositiveSmallIntegerField(null=False)
    status = models.CharField(max_length=1, null=False, blank=False, choices=STATUS_CHOICES, default='A')
    data = JSONField(default=dict)
    # data  ::= {"elements": [elementObj*]}
    # elementObj ::= pathObj
    # pathObj ::= {"elt": "path", "pointsX": [float], "pointsY: [float]}

    class Meta:
        unique_together = (('slide', 'order'),)
        ordering = ['order']

    def save(self, *args, **kwargs):
        with transaction.atomic():
            if not self.order:
                maxorder = Annotation.objects.filter(slide_id=self.slide_id).aggregate(Max('order'))['order__max']
                if maxorder is None:
                    self.order = 1
                else:
                    self.order = maxorder + 1

            super(Annotation, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        # soft delete so we can redo an undo.
        self.status = 'D'
        self.save()


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

