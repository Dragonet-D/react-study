import React, { Component } from "react";
import OlMap from "ol/map";
import OlLayerTile from "ol/layer/tile";
import OlSourceOsm from "ol/source/osm";
import OlView from "ol/view";
import OlProj from "ol/proj";

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
        layerUrl: "https://maps-{a-c}.onemap.sg/v3/Grey/{z}/{x}/{y}.png",
        target: `map_${Math.random}`
    }
    componentDidMount() {
        const {
            zoom,
            center,
            target,
            layerUrl
        } = this.props;
        this.map = new OlMap({
            layers: [
                new OlLayerTile({
                    name:target,
                    source: new OlSourceOsm({
                        url: layerUrl
                    })
                })
            ],
            view: new OlView({
                center: OlProj.fromLonLat(center),
                zoom,
            }),
            target
        });
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
        );
    }
}
