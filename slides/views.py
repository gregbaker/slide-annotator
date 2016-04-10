from django.shortcuts import render, get_object_or_404, get_list_or_404
from django.http import JsonResponse
from .models import Deck, Slide, Annotation


def index(request):
    decks = Deck.objects.all()
    context = {
        'decks': decks,
    }
    return render(request, 'slides/index.html', context=context)


def deck(request, course_slug, deck_slug, slide_slug=None):
    deck = get_object_or_404(Deck, course__slug=course_slug, slug=deck_slug)
    if slide_slug:
        slide = get_object_or_404(Slide, deck=deck, slug=slide_slug)
    else:
        slide = get_list_or_404(Slide, deck=deck)[0]

    context = {
        'deck': deck,
        'slide': slide,
    }
    return render(request, 'slides/deck.html', context=context)

def slide_data(request, course_slug, deck_slug, slide_slug):
    deck = get_object_or_404(Deck, course__slug=course_slug, slug=deck_slug)
    slide = get_object_or_404(Slide, deck=deck, slug=slide_slug)
    annotations = Annotation.objects.filter(slide=slide)

    data = {
        'title': slide.title,
        'content': slide.content,
        'annotations': [a.data for a in annotations],
    }
    return JsonResponse(data, json_dumps_params={'indent': 1})

