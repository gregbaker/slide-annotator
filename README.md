# slide-annotator
Tool for presenting and annotating presentation slides.

## Making it go: Option 1, Vagrant

Install [VirtualBox](https://www.virtualbox.org/) and [Vagrant](https://www.vagrantup.com/). Then,

```bash
vagrant up
vagrant ssh
./server/manage.py runserver 0:8000
```

## Making it go: Option 2, Manually

If you have a Linux (or OSX?) system, you should be able to install the requirements on your system and then run the server.

Instructions should be here, but see [chef recipe](chef-cookbooks/setup/recipes/default.rb) that (pretty much by definition) has the details of what needs to be done.

## Overview

The basics of what happens here:

* A slide page is assembled by JavaScript (ReactJS specifically).
* Slides are HTML and delivered to the browser by the Django API. (Existing slides are test data in ```initial_data.json```.)
* Annotations (things drawn on the slides) are SVG elements, stored per-slide and drawn by the React logic.
* When the user draws on the page, it is pushed to the API on the server. All clients update their annotations regularly, so everybody is seeing the same thing.

## TODO

* Some clients should be able to annotate; some should be view-only.
* The React code is polling every 2 seconds. It should be a websocket (with Django Channels).
* Text annotations.
* Slide flipping.
* Ability to insert annotation-only slides on the fly.
* A frontend for creating slides.
