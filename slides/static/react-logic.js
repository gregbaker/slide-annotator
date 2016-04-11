var aspect = 4/3;
var pathDecimals = 2;

var stroke_attrs = function() {
    return {
        strokeWidth: 0.25,
        stroke: '#ff7700',
        fill: 'none',
        strokeLinejoin: 'round',
    };
};

var svg_attrs = function() {
    var slideSizeCSS;
    var widthUnits = 100;
    var heightUnits = 100/aspect;
    var style = {
        zIndex: 10,
        position: 'absolute',
        top: 0,
        left: 0,
    };
    if ( window.innerWidth/window.innerHeight > aspect ) {
        // window wider than aspect ratio
        style.width = (100*aspect) + 'vh';
        style.height = '100vh';
    } else {
        // window higher than aspect ratio
        style.width = '100vw';
        style.height =  (100 / aspect) + 'vw';
    }

    return {
        id: 'slide-overlay',
        width: widthUnits,
        height: heightUnits,
        viewBox: '0 0 ' + widthUnits + ' ' + heightUnits,
        style: style,
    }
}

var pathAnnotationToPath = function (ann, id, i) {
    var n = ann.pointsX.length;
    var d;
    var key = id + '-' + i

    if ( n > 1 ) {
        d = 'M' + ann.pointsX[0].toFixed(pathDecimals) + ',' + ann.pointsY[0].toFixed(pathDecimals);
        d += ' L'
        for ( var i=1; i<n; i++ ) {
            d += ' ' + ann.pointsX[i].toFixed(pathDecimals) + ',' + ann.pointsY[i].toFixed(pathDecimals);
        }
        return <path key={key} {...stroke_attrs()} d={d} />
    }

};

var Annotation = React.createClass({
    render: function() {
        var id = this.props.a.id;
        var elements = this.props.a.data.elements;
        var elts = elements.map(function (e, i) {
            if ( e.elt == 'path' ) {
              return pathAnnotationToPath(e, id, i)
            }
        });
        return (
            <g key={id}>{elts}</g>
        );
    }
});

var AnnotationSet = React.createClass({
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
        return {data: []};
    },
    componentDidMount: function() {
        this.loadFromServer();
    },
    render: function() {
        var annotations = this.state.data.map(function (a) {
            return (
                <Annotation key={a.id} a={a}/>
            );
        });
        return (
            <svg id="annotation-set" {...svg_attrs()} >{annotations}</svg>
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
        return (
            <div id="slide">
            <div id="slide-contents" dangerouslySetInnerHTML={this.rawMarkup()}></div>
            <AnnotationSet/>
            </div>
        );
    }
});
ReactDOM.render(
    <Slide />,
    document.getElementById('content')
);