import React, { Component } from "react";
import L from "leaflet";
import a from "proj4leaflet/src/proj4leaflet";
import OlProj from "ol/proj";
console.log(a)
export default class LeafletCoordinate extends Component{
  componentDidMount() {
    // [103.84435325860977, 1.38758564176523] [51.505, -0.09]
    const center = [103.84435325860977, 1.38758564176523];
    // const centeraa = OlProj.transform(center, 'WGS84' ,'EPSG:4326');
    this.map = L.map('map').setView([39.897445, 116.331398], 10);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(this.map);
  };
  render() {
    return (
      <div id="map" style={{width: "100vw", height: "100vh"}} />
    );
  }
}
