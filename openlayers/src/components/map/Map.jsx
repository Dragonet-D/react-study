import React, { Component } from "react";
import OlMap from "ol/map";

export default class Map extends Component {
    static defaultProps = {
        settings: {
            width: "100%",
            height: "100%"
        },
        center: [103.784342, 1.352586],
        zoom: 12,
        layerUrl: "https://map-{a-c}.onemap.sg/v3/Grey/{x}{y}.png"
    }
    componentDidMount() {
        const {} = this.props;
    }
    render() {
        return (
            <div>map</div>
        )
    }
}
