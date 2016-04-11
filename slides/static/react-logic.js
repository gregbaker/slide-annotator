var aspect = 4/3;
var pathDecimals = 2;
var widthUnits = 100;
var heightUnits = 100/aspect;
var pollInterval = 2000;
var fontVH = 1;
var colors = ['#f00', '#0f0', '#00f'];


var strokeAttrs = function() {
    return {
        strokeWidth: 0.25,
        stroke: '#ff7700',
        fill: 'none',
        strokeLinejoin: 'round',
    };
};

var size_props = function () {
    var style = {}
    if ( window.innerWidth/window.innerHeight > aspect ) {
        // window wider than aspect ratio
        style.width = (100*aspect) + 'vh';
        style.height = '100vh';
        style.fontSize = fontVH + 'vh';
    } else {
        // window higher than aspect ratio
        style.width = '100vw';
        style.height =  (100 / aspect) + 'vw';
        style.fontSize = (fontVH / aspect) + 'vw';
    }
    return style;
};

var svg_attrs = function () {
    var slideSizeCSS;
    var sizeStyle = size_props();
    var style = {
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
        width: sizeStyle.width,
        height: sizeStyle.height,
    };

    return {
        id: 'slide-overlay',
        width: widthUnits,
        height: heightUnits,
        viewBox: '0 0 ' + widthUnits + ' ' + heightUnits,
        style: style,
    }
};

var roundCoordinate = function (x) {
    var factor = Math.pow(10,pathDecimals);
    return Math.round(x*factor)/factor
};





var Controls = React.createClass({

    render: function () {
        var colorControls = this.props.colors.map(function (c, i) {
            var handleClick = function() {
                this.props.changeStrokeColor(c);
            }.bind(this);
            return <rect key={c} x={1 + i*4} y={heightUnits-3} width="3" height="2" fill={c} onClick={handleClick} />;
        }.bind(this));
        return <g id="color-controls">{colorControls}</g>;
    },
});


var Annotation = React.createClass({
    pathAnnotationToPath: function (ann, id, i) {
        var n = ann.pointsX.length;
        var d;
        var key = id + '-' + i

        if ( n > 1 ) {
            d = 'M' + ann.pointsX[0] + ',' + ann.pointsY[0];
            d += ' L'
            for ( var i=1; i<n; i++ ) {
                d += ' ' + ann.pointsX[i] + ',' + ann.pointsY[i];
            }
            return <path key={key} {...this.props.defaultStrokeAttrs} d={d} />
        }
    },
    render: function() {
        var id = this.props.a.id;
        var elements = this.props.a.data.elements;
        var elts = elements.map(function (e, i) {
            if ( e.elt == 'path' ) {
              return this.pathAnnotationToPath(e, id, i)
            }
        }.bind(this));
        return (
            <g key={id}>{elts}</g>
        );
    }
});

var AnnotationSet = React.createClass({
    pathStart: function(x, y) {
        var x = x / this.props.container.offsetWidth * widthUnits;
        var y = y / this.props.container.offsetHeight * heightUnits;

        var workingElement = {
            id: 'newid-' + this.state.numAdded,
            order: 9999 + this.state.numAdded,
            data: {elements: [{
                elt: 'path',
                pointsX: [roundCoordinate(x)],
                pointsY: [roundCoordinate(y)],
            }]},
        }

        this.setState({
            paint: true,
            numAdded: this.state.numAdded + 1,
            previousLength: this.state.data.length,
            workingElement: workingElement,
            data: this.state.data.concat([workingElement]),
        });

    },
    pathMore: function(x, y) {
        var x = x / this.props.container.offsetWidth * widthUnits;
        var y = y / this.props.container.offsetHeight * heightUnits;

        var workingElement = this.state.workingElement;
        var path = workingElement.data.elements[0];
        path.pointsX = path.pointsX.concat([roundCoordinate(x)])
        path.pointsY = path.pointsY.concat([roundCoordinate(y)])

        this.setState({
                workingElement: workingElement,
            });

    },
    pathEnd: function() {
        this.setState({
            paint: false,
        });

        var workingElement = this.state.workingElement;
        var postData = {'data': workingElement.data};
        $.ajax({
            url: annotation_api_url,
            type: 'POST',
            dataType: 'json',
            contentType:"application/json; charset=utf-8",

            beforeSend: function (request)
            {
                request.setRequestHeader("X-CSRFToken", csrf_token);
            },
            data: JSON.stringify(postData),

            success: function(data) {
                var ann = this.state.data.slice(0, this.state.previousLength);
                ann.push(data);
                this.setState({
                    data: ann
                });
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props, status, err.toString());
            }.bind(this)
        });
    },

    handleMouseDown: function(e) {
        e.preventDefault();
        this.pathStart(e.pageX, e.pageY);
    },
    handleMouseMove: function(e) {
        if ( this.state.paint ) {
            e.preventDefault();
            this.pathMore(e.pageX, e.pageY);
        }
    },
    handleTouchStart: function(e) {
        e.preventDefault();
        this.pathStart(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
    },
    handleTouchMove: function(e) {
        if ( this.state.paint ) {
            e.preventDefault();
            this.pathMore(e.changedTouches[0].pageX, e.changedTouches[0].pageY);
        }className
    },
    handleDrawStop: function(e) {
        if ( this.state.paint ) {
            e.preventDefault();
            this.pathEnd();
        }
    },

    changeStrokeColor: function(c) {
        var sa = this.state.strokeAttrs;
        sa.stroke = c;
        this.setState({strokeAttrs: sa});
    },

    loadFromServer: function () {
        $.ajax({
            url: annotation_api_url,
            dataType: 'json',
            cache: 'false',
            success: function (data) {
                this.setState({data: data})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this),
        });
    },
    getInitialState: function () {
        return {
            data: [],
            paint: false,
            numAdded: 0,
            workingElement: null,
            previousLength: 0,
            strokeAttrs: strokeAttrs(),
        };
    },
    componentDidMount: function() {
        this.loadFromServer();
        setInterval(this.loadFromServer, pollInterval);
    },
    render: function() {
        var annotations = this.state.data.map(function (a) {
            return (
                <Annotation key={a.id} a={a} defaultStrokeAttrs={this.state.strokeAttrs}/>
            );
        }.bind(this));
        var svgEvents = {
            onMouseDown: this.handleMouseDown,
            onMouseMove: this.handleMouseMove,
            onMouseUp: this.handleDrawStop,
            onMouseLeave: this.handleDrawStop,
            onTouchStart: this.handleTouchStart,
            onTouchMove: this.handleTouchMove,
            onTouchEnd: this.handleDrawStop,
            onTouchCancel: this.handleDrawStop,
        };

        return (
            <svg id="annotation-set" {...svg_attrs()} {...svgEvents} >
                {annotations}
                <Controls colors={colors} changeStrokeColor={this.changeStrokeColor} />
            </svg>
        );
    }
});

var Slide = React.createClass({
    loadFromServer: function () {
        $.ajax({
            url: slide_api_url,
            dataType: 'json',
            cache: 'false',
            success: function (data) {
                this.setState({data: data})
            }.bind(this),
            error: function(xhr, status, err) {
                console.error(this.props.url, status, err.toString());
            }.bind(this),
        });
    },
    rawMarkup: function() {
        var rawMarkup = this.state.data.content;
        return { __html: rawMarkup };
    },
    getInitialState: function () {
        return {data: []};
    },
    componentDidMount: function() {
        this.loadFromServer();
    },
    render: function() {
        var html = document.documentElement;
        var container = document.getElementById(this.props.containerId);
        var sizeStyle = size_props();
        container.className = 'slide';
        container.style.width = sizeStyle.width;
        container.style.height = sizeStyle.height;
        // set font-size on <html> so 1rem is a predictable 1% of slide height.
        html.style.fontSize = sizeStyle.fontSize;

        return (
            <div id="slide">
            <div id="slide-contents" dangerouslySetInnerHTML={this.rawMarkup()}></div>
            <AnnotationSet container={container} />
            </div>
        );
    }
});
ReactDOM.render(
    <Slide containerId='slide-container' />,
    document.getElementById('slide-container')
);