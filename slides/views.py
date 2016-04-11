from django.shortcuts import render, get_object_or_404, get_list_or_404
from .models import Deck, Slide


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

