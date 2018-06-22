import React, { Component } from "react";
import OlMap from "ol/map";

export default class Map extends Component {
    constructor(props) {
        super(props);
        this.map = {};
    }
    static defaultProps = {
        settings: {
            width: "100%",
            height: "100%"
        },
        center: [103.784342, 1.352586],
        zoom: 12,
        layerUrl: "https://map-{a-c}.onemap.sg/v3/Grey/{x}{y}.png",
        target: `map_${Math.random}`
    }
    componentDidMount() {
        const {
            zoom,
            center,
            target,
            layerUrl
        } = this.props;
    }
    render() {
        const {
            zoom,
            center,
            target,
            layerUrl
        } = this.props;
        return (
            <div id={target}/>
        )
    }
}
