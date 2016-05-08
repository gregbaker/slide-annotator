var aspect = 4/3;
var pathDecimals = 2;
var widthUnits = 10000;
var heightUnits = widthUnits/aspect;
var strokeWidth = Math.round(widthUnits/600);
var fontSize = Math.round(heightUnits/10);
var pollInterval = 2000;
var fontVH = 1; /* percent of slide height represented by 1rem */
var colors = ['#d00', '#d70', '#cc0', '#090', '#00f', '#70e'];
var initialColor = '#d00';

var slide_api_url = function (pk) {
    return '/api/slide-data/' + pk + '/';
};
var annotation_api_url = function (pk) {
    return '/api/annotations/' + pk + '/';
};
var annotation_detail_url = function (pk, ann_pk) {
    return '/api/annotations/' + pk + '/' + ann_pk + '/';
};
