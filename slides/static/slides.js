"use strict";

var aspect = 4/3;
var pathDecimals = 2;

// from http://stackoverflow.com/a/3642265/1236542
function makeSVG(tag, attrs) {
  var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (var k in attrs)
    el.setAttribute(k, attrs[k]);
  return el;
}


function updatePath(svg, path, pointsX, pointsY) {
  var n = pointsX.length;
  var d;

  if ( n > 1 ) {
    d = 'M' + pointsX[0].toFixed(pathDecimals) + ',' + pointsY[0].toFixed(pathDecimals);
    d += ' L'
    for ( var i=1; i<n; i++ ) {
      d += ' ' + pointsX[i].toFixed(pathDecimals) + ',' + pointsY[i].toFixed(pathDecimals);
    }
    path.setAttribute('d', d);
  } else if ( n == 1 ) {
    // TODO: handle drawing a point
  }
}

function setup() {
  function pathStart(x, y) {
    var x = x / body.offsetWidth * widthUnits;
    var y = y / body.offsetHeight * heightUnits;

    paint = true;
    pointsX = [x];
    pointsY = [y];

    path = makeSVG('path', stroke_attrs);
    svg.appendChild(path);

    updatePath(svg, path, pointsX, pointsY);
  }

  function pathMore(x, y) {
    if(paint){
      var x = x / body.offsetWidth * widthUnits;
      var y = y / body.offsetHeight * heightUnits;

      pointsX.push(x);
      pointsY.push(y);

      updatePath(svg, path, pointsX, pointsY);
    }
  }

  function pathEnd() {
    paint = false;
  }

  function mousedown(e) {
    e.preventDefault();
    pathStart(e.pageX, e.pageY);
  }
  function touchstart(e) {
    e.preventDefault();
    pathStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  }
  function mousemove(e) {
    e.preventDefault();
    pathMore(e.pageX, e.pageY);
  }
  function touchmove(e) {
    e.preventDefault();
    pathMore(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
  }
  function drawstop(e) {
    pathEnd();
  }


  var widthUnits = 100;
  var heightUnits = 100/aspect;
  var aspectHeight = widthUnits/aspect;
  var slideSizeCSS;
  var body = document.getElementsByTagName('body').item(0);
  var paint = false;
  var path, pointsX, pointsY;
  var stroke_attrs = {
    'stroke-width': 0.25,
    'stroke': '#ff7700',
    'fill': 'none',
    'stroke-linejoin': 'round',
  };

  if ( window.innerWidth/window.innerHeight > aspect ) {
      // window wider than aspect ratio
      slideSizeCSS = 'width: ' + (100*aspect) + 'vh; height: 100vh;';
  } else {
      // window higher than aspect ratio
      slideSizeCSS = 'width: 100vw; height: ' + (100 / aspect) + 'vw;';
  }

  // Create SVG element
  var svg = makeSVG('svg', {
    id: 'slide-overlay',
    width: widthUnits,
    height: heightUnits,
    viewBox: '0 0 ' + widthUnits + ' ' + heightUnits,
    style: 'z-index: 10; position: absolute; top: 0; left: 0; ' + slideSizeCSS,
  });
  var defs = makeSVG('defs', {});
  svg.appendChild(defs);

  // Style body as a slide
  body.setAttribute('style', 'box-sizing: border-box; ' + slideSizeCSS);
  body.appendChild(svg);

  svg.addEventListener('mousedown', mousedown, false);
  svg.addEventListener('touchstart', touchstart, false);
  svg.addEventListener('mousemove', mousemove, false);
  svg.addEventListener('touchmove', touchmove, false);
  svg.addEventListener('mouseup', drawstop, false);
  svg.addEventListener('touchend', drawstop, false);
  svg.addEventListener('mouseleave', drawstop, false);
  svg.addEventListener('touchleave', drawstop, false);
}

document.addEventListener("DOMContentLoaded", setup);