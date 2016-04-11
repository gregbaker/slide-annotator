var Slide = React.createClass({
    loadSlideFromServer: function () {
        $.ajax({
            url: slide_content_url,
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
        this.loadSlideFromServer();
    },
    render: function() {
        return (
            <div dangerouslySetInnerHTML={this.rawMarkup()}></div>
        );
    }
});
ReactDOM.render(
    <Slide />,
    document.getElementById('content')
);