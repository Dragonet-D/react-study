import React, { Component } from "react";
import OlMap from "ol/map";
import OlLayerTile from "ol/layer/tile";
import OlSourceOsm from "ol/source/osm";
import OlView from "ol/view";
import OlProj from "ol/proj";
import OlOverlay from "ol/overlay";

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
        target: `map_${Math.random}`,
    }
    state = {
        dataSource: [
            {
                id: "id2",
                center: [103.8542, 1.3293]
            }, {
                id: "id3",
                center: [103.85530471801756, 1.3291406454039345]
            }, {
                id: "id4",
                center: [103.84435325860977, 1.38758564176523]
            }, {
                id: "id5",
                center: [103.63532602787018, 1.3503457557834744]
            }
        ]
    }
    componentDidMount() {
        const {
            zoom,
            center,
            target,
            layerUrl,
        } = this.props;
        const { dataSource } = this.state;
        this.map = new OlMap({
            layers: [
                new OlLayerTile({
                    name: target,
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
        dataSource.forEach(item => {
            this.map.addOverlay(new OlOverlay({
                position: OlProj.fromLonLat(item.center),
                element: document.getElementById(item.id),
                stopEvent: false
            }));
        })
    }
    render() {
        const {
            zoom,
            center,
            target,
            layerUrl,
        } = this.props;
        const { dataSource } = this.state;
        return (
            <div>
                <div id={target}>
                    {
                        dataSource.map(item => (
                            <div
                                id={item.id}
                                key={item.id}
                                style={{ width: "30px", height: "30px" }}
                            >
                                <img
                                    src="//www.baidu.com/img/bd_logo1.png"
                                    alt="picture"
                                    style={{ width: "100%", height: "100%" }}
                                />
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}
